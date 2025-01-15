import { exec } from 'child_process'
import os from 'os'
import path from 'path'
import { promisify } from 'util'
import projectConfig from '@/project.config'
const execAsync = promisify(exec)

async function deploymentProcessStop({ appName, level, type }: { appName: string, level: string, type: string }) {
    try {
        const configPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "configs", level, type)
        const result = await execAsync(`pm2 stop ${configPath}.json`, { env: { ...process.env } })
        return {
            status: 200,
            message: "process stopped",
            result: result
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "process stop failed",
            error: error
        }
    }
}

export default deploymentProcessStop    