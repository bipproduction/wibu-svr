import path from "path"
import fs from 'fs/promises'
import os from 'os'
import projectConfig from "@/project.config"
async function deploymentProcessConfigFind({ appName, level, type }: { appName: string, level: string, type: string }) {
    try {
        const configPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "configs", level, type)
        const config = await fs.readFile(configPath + ".json", 'utf8')
        const configJson = JSON.parse(config)
        return {
            status: 200,
            success: true,
            message: "process config found",
            data: configJson
        }
    } catch (error) {
        return {
            status: 404,
            message: "process config not found",
            error: error
        }
    }
}

export default deploymentProcessConfigFind  