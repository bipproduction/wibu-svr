/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ProjectEnv } from "@/constant/project-env";
import Elysia, { t } from "elysia";
import fs from "fs/promises";
import path from "path";
import buildDeployment from "./build";
import createDeployment from "./create-deployment";
import hasDeployment from "./utils/has-deployment";
import getProductionUpdate from "./routes/get-production-update";

const deployed = new Elysia({ prefix: "/api/deployed" })
    .get("/", async ({ projectEnv }: { projectEnv: ProjectEnv }) => {
        const dir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments")
        const files = await fs.readdir(dir)
        return {
            data: files
        }
    }, { tags: ["deployed"], detail: { summary: "Get list of deployed files", description: "Get list of deployed files on remote repository" } })
    .get("/production/update/:name", async ({ params, projectEnv }: { params: { name: string }, projectEnv: ProjectEnv }) => {
        const res = await getProductionUpdate({ projectEnv, name: params.name })
        return res
    }, { tags: ["deployed"], params: t.Object({ name: t.String() }), detail: { summary: "Get production update by name on remote repository" } })
    .get("/production/:deployment", async ({ params, projectEnv }: { params: { deployment: string }, projectEnv: ProjectEnv }) => {
        const dir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments", params.deployment, "deployed", "production", "releases")
        const hasDep = await hasDeployment(dir)
        if (!hasDep) {
            return {
                success: false,
                message: "no deployment"
            }
        }
        const files = await fs.readdir(dir)
        return {
            data: files
        }

    }, { tags: ["deployed"], params: t.Object({ deployment: t.String() }), detail: { summary: "Get production update by deployment name" } })
    .post("/build/production/:deployment/:release", async ({ params, projectEnv }: { params: { deployment: string, release: string }, projectEnv: ProjectEnv }) => {

        const dir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments", params.deployment, "deployed", "production", "releases", params.release)
        const res = await buildDeployment(dir)
        console.log(res)
        return {
            data: res
        }
    }, { tags: ["deployed"], params: t.Object({ deployment: t.String(), release: t.String() }), detail: { summary: "Build production release" } })
    .get("/has-deployment/:name", async ({ params, projectEnv }: { params: { name: string }, projectEnv: ProjectEnv }) => {
        const dir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments", params.name)
        const hasDep = await hasDeployment(dir)
        return {
            data: hasDep
        }
    }, { tags: ["deployed"], params: t.Object({ name: t.String() }), detail: { summary: "Check if deployment exists by name" } })
    .put("/:name", async ({ params, projectEnv }: { params: { name: string }, projectEnv: ProjectEnv }) => {

        const create = await createDeployment({ name: params.name, projectEnv })
        return create
    }, { tags: ["deployed"], params: t.Object({ name: t.String() }), detail: { summary: "Create deployment by name" } })
    .delete("/:name", async ({ params, projectEnv }: { params: { name: string }, projectEnv: ProjectEnv }) => {
        const dir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployed", params.name)
        await fs.rm(dir, { recursive: true })
        return {
            data: "deployed"
        }
    }, { tags: ["deployed"], params: t.Object({ name: t.String() }), detail: { summary: "Delete deployment by name" } })


export default deployed
