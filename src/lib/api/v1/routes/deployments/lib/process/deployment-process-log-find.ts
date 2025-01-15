import path from "path"
import fs from "fs/promises"
import projectConfig from "@/project.config"
import readdirp from "readdirp"


async function deploymentProcessLogFind({ appName, level, type }: { appName: string, level: string, type: string }) {
    try {
        const configPath = path.join(projectConfig.pathPrefix.toLog(appName), "process", level, type)
        const data = []
        for await (const entry of readdirp(configPath)) {
            const fileFullPath = entry.fullPath 
            const fileData = await fs.readFile(fileFullPath, "utf-8")
            const dataPush = {
                appName,
                level,
                type,
                fileName: path.basename(fileFullPath),  
                text: fileData
            }
            data.push(dataPush)
        }
        return {
            status: 200,
            success: true,
            message: "Log berhasil ditemukan",
            data: data
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            success: false,
            message: "Gagal mendapatkan data log",
            data: []
        }
    }
}

export default deploymentProcessLogFind