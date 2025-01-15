import path from "path"
import os from "os"
import projectConfig from "@/project.config"
import fs from "fs/promises"

async function deploymentReleaseBuildLogFindMany({appName}: {appName: string}) {
    try {
        const logFile = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, projectConfig.pathPrefix.logs, "build")
    const logs = await fs.readdir(logFile)
    const logList = logs.map((log) => {
        return {
            logName: log.split(".")[0],
            appName,
        }
    })
    return {
        status: 200,
            success: true,
            message: "build logs fetched",
            data: logList
        }
    } catch (error) {
        return {
            status: 400,
            success: false,
            message: error
        }
    }
}

export default deploymentReleaseBuildLogFindMany