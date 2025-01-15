import path from "path"
import os from "os"
import projectConfig from "@/project.config"
import fs from "fs/promises"

async function deploymentReleaseBuildLogFind({ appName, fileName }: { appName: string, fileName: string }) {
    try {
        const logFile = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, projectConfig.pathPrefix.logs, "build", `${fileName}.log`)
        const log = (await fs.readFile(logFile, "utf-8")).toString().trim()

        return log
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            success: false,
            message: "build log not found",
        }
    }
}

export default deploymentReleaseBuildLogFind