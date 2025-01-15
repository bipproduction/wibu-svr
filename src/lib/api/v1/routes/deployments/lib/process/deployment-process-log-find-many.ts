import path from "path"
import readdirp from "readdirp"
import fs from 'fs/promises'
import projectConfig from "@/project.config"

async function deploymentProcessLogFindMany({ appName }: { appName: string }) {
    try {
        const configPath = path.join(projectConfig.pathPrefix.toLog(appName), "process")
        await fs.access(configPath)
        const result = []

        // Mengumpulkan semua path file log
        for await (const entry of readdirp(configPath)) {
            // without .DS_Store    
            const logPath = entry.path
            if (logPath.includes("output") && !logPath.includes(".DS_Store")) {
                result.push(logPath)
            }
        }

        // Membaca isi setiap file log
        const dataJson = await Promise.all(
            result.filter((logPath) => logPath.includes("output")).map(async (logPath) => {
                return {
                    filename: path.basename(logPath),
                    appName: appName,
                    level: logPath.split("/")[0],
                    type: logPath.split("/")[1],
                }
            })
        )

        return {
            status: 200,
            success: true,
            message: "Berhasil mendapatkan data log",
            data: dataJson
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

export default deploymentProcessLogFindMany