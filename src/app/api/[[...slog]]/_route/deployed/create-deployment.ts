import { exec } from "child_process";
import { promisify } from 'util';
import type { ProjectEnv } from "@/constant/project-env";
import path from "path";
import fs from "fs/promises";
import hasOverview from "./utils/has-overview";
import getOverview from "./utils/get-overview";
import getSha from "./utils/get-sha";
import getReleases from "./utils/get-releases";
import hasDeployment from "./utils/has-deployment";

const execPromise = promisify(exec)

async function createDeployment({ name, projectEnv }: { name: string, projectEnv: ProjectEnv }) {
    const overviewPath = path.join(projectEnv.PROJECT_ROOT_DIR, "overviews", name + ".json")
    const hasOverv = await hasOverview(overviewPath)
    if (!hasOverv) {
        return {
            success: false,
            message: `${name} Overview not found`
        }
    }

    const overview = await getOverview(overviewPath)

    if (!overview) {
        return {
            success: false,
            message: "Overview not found"
        }
    }

    const dir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments", name)
    const hasDep = await hasDeployment(dir)
    if (hasDep) {
        return {
            success: false,
            message: "Deployment already exists"
        }
    }


    const productionCurrentDir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments", name, "deployed", "production", "current")
    const productionReleasesDir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments", name, "deployed", "production", "releases")

    await fs.mkdir(productionCurrentDir, { recursive: true })
    await fs.mkdir(productionReleasesDir, { recursive: true })

    const sha = await getSha({ repo: overview.project.repository, branch: overview.project.deployments.production.branch })
    const deployName = `${name}-${sha}`

    const listReleases = await getReleases(productionReleasesDir)
    if (listReleases.includes(deployName)) {
        return {
            success: false,
            message: "Deployment already exists"
        }
    }

    // clone production
    const res = await execPromise(`git clone -b ${overview.project.deployments.production.branch} ${overview.project.repository} ${productionReleasesDir}/${deployName}`)
    if (res.stderr) {
        return {
            success: false,
            message: res.stderr
        }
    }

    return {
        success: true,
        message: res.stdout
    }
}

export default createDeployment