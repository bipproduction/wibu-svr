import { exec } from 'child_process'
import { promisify } from 'util'
import projectConfig from '@/project.config'
import path from 'path'
import os from 'os'
const execAsync = promisify(exec)

async function deploymentProcessDelete({ appName, level, type }: { appName: string, level: string, type: string }) {
    try {
        const configPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "configs", level, type)
        const result = await execAsync(`pm2 delete ${configPath}.json`, { env: { ...process.env } })
        return {
            status: 200,
            message: "process deleted",
            result: result
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "process delete failed",
            error: error
        }
    }
}

export default deploymentProcessDelete      