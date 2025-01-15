import path from "path"
import fs from "fs/promises"
import projectConfig from "@/project.config"


async function deploymentProcessLogClear({ appName, level, type }: { appName: string, level: string, type: string }) {
    try {
        const configPath = path.join(projectConfig.pathPrefix.toLog(appName), "process", level, type)
        await fs.rmdir(configPath, { recursive: true })
        return {
            status: 200,
            success: true,
            message: "Log berhasil dihapus"
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            success: false,
            message: "Gagal menghapus log"
        }
    }
}

export default deploymentProcessLogClear