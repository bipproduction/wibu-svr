import path from "path"
import projectConfig from "@/project.config"
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

async function deploymentProcessStart({ appName, level, type }: { appName: string, level: string, type: string }) {
    try {
        const configPath = path.join(projectConfig.pathPrefix.toConfig(appName), level)

        await execAsync(`pm2 start ${type}.json`, { cwd: configPath, env: {...process.env,  NODE_ENV: "production" } })
        return {
            status: 200,
            message: `process ${appName} ${level} ${type} started`,
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "process start failed",
            error: error
        }
    }
}

export default deploymentProcessStart       