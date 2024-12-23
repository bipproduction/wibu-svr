/* eslint-disable @typescript-eslint/no-unused-vars */
import Elysia from "elysia";
import { t } from "elysia";
import fs from "fs/promises";
import path from "path";
import os from "os";

const deployed = new Elysia({ prefix: "/api/deployed" })
    .get("/", () => {
        return {
            data: "deployed"
        }
    }, { tags: ["deployed"] })
    .get("/:name", () => {
        return {
            data: "deployed"
        }
    }, { tags: ["deployed"] })
    .put("/:name", async ({ params }: { params: { name: string } }) => {
        const dir = path.join(os.homedir(), "wibu-svr", "deployed", params.name)
        const exists = await hasDeployed(dir)
        if (exists) {
            return {
                success: false,
                message: "File already exists"
            }
        }

        await fs.mkdir(dir, { recursive: true })
        return {
            success: true,
            message: "File created"
        }
    }, { tags: ["deployed"], params: t.Object({ name: t.String() }) })
    .delete("/:name", async ({ params }: { params: { name: string } }) => {
        const dir = path.join(os.homedir(), "wibu-svr", "deployed", params.name)
        await fs.rm(dir, { recursive: true })
        return {
            data: "deployed"
        }
    }, { tags: ["deployed"] })


export default deployed

async function hasDeployed(dir: string) {

    try {
        await fs.access(dir)
        return true
    } catch (error) {
        return false
    }
}