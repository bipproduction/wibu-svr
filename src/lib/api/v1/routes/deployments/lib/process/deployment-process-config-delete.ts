import path from "path"
import fs from 'fs/promises'
import os from 'os'
import projectConfig from "@/project.config"

async function deploymentProcessConfigDelete({ appName, level, fileName }: { appName: string, level: string, fileName: string }) {
    try {
        const configPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "configs", level, fileName)
        await fs.unlink(configPath)
        return {
            status: 200,
            message: "process config deleted"
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "process config delete failed",
            error: error
        }
    }
}

export default deploymentProcessConfigDelete   