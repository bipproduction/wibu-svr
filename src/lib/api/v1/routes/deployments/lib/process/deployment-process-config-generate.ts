import { type Overview } from "@/types/Overview"
import { PM2App, PM2Config } from "@/types/Pm2Config"
import fs from 'fs/promises'
import path from 'path'
import projectConfig from "@/project.config"
import overviewFind from "../../../overviews/lib/overview-find"

async function deploymentProcessConfigGenerate({
    appName,
    level
}: {
    appName: string,
    level: string
}) {
    // Validasi input
    if (!appName || !level) {
        console.error('Missing required parameters: appName or level');
        return {
            status: 400,
            success: false,
            message: "appName and level are required"
        };
    }

    try {

        const { data, success } = await overviewFind({ appName });

        if (!success) {
            return {
                status: 400,
                success: false,
                message: "overview not found"
            };
        }

        const overview: Overview = data;
        const projectLevel = overview.project.levels[level as keyof typeof overview.project.levels];

        // Validasi projectLevel
        if (!projectLevel) {
            console.error(`Invalid level: ${level}`);
            return {
                status: 400,
                success: false,
                message: `Level '${level}' tidak ditemukan dalam konfigurasi project`
            };
        }

        // Validasi konfigurasi port
        if (!projectLevel.deployed?.current?.ports?.length || !projectLevel.deployed?.releases?.ports?.length) {
            console.error(`Missing port configuration for ${level}`);
            return {
                status: 400,
                success: false,
                message: "Konfigurasi port tidak ditemukan"
            };
        }

        const deployedPath = path.join(projectConfig.pathPrefix.toDeployed(appName), level, "current")
        const logsPath = path.join(projectConfig.pathPrefix.toLog(appName), "process")

        // Helper function untuk membuat PM2 app config
        const createPM2App = (port: number, type: "main" | "preview"): PM2App => ({
            name: `${appName}-${level}-${type}-${port}`,
            script: `bun`,
            args: `run start`,
            exec_mode: "fork",
            instances: 1,
            env: { ...projectLevel.env, PORT: port, NODE_ENV: "production" },
            error_file: path.join(logsPath, level, type, `error-${port}.log`),
            out_file: path.join(logsPath, level, type, `output-${port}.log`),
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_memory_restart: "1G",
            autorestart: true,
            watch: false,
            wait_ready: true,
            restart_delay: 4000,
            merge_logs: true,
            time: true,
            max_size: "10M",
            retain: 5,
            compress: true,
            cwd: path.join(deployedPath, type),
            source_map_support: false,
        });

        // Membuat konfigurasi untuk current dan releases menggunakan helper function
        const pm2ConfigMain: PM2Config = {
            apps: projectLevel.deployed.current.ports.map(port => createPM2App(port, "main"))
        };

        const pm2ConfigPreview: PM2Config = {
            apps: projectLevel.deployed.releases.ports.map(port => createPM2App(port, "preview"))
        };

        const configPath = path.join(projectConfig.pathPrefix.toConfig(appName), level)
        
        // Menambahkan try-catch khusus untuk operasi file system
        try {
            await fs.mkdir(configPath, { recursive: true });
            await fs.writeFile(path.join(configPath, "main.json"), JSON.stringify(pm2ConfigMain, null, 2), { encoding: "utf-8", flag: "w" });
            await fs.writeFile(path.join(configPath, "preview.json"), JSON.stringify(pm2ConfigPreview, null, 2), { encoding: "utf-8", flag: "w" });
        } catch (fsError) {
            console.error(`File system error: ${fsError instanceof Error ? fsError.message : 'Unknown error'}`);
            return {
                status: 500,
                success: false,
                message: "Gagal menyimpan konfigurasi process"
            };
        }

        return {
            status: 200,
            success: true,
            message: "process config created"
        };

    } catch (error) {
        console.error(`Error creating process config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return {
            status: 500,
            success: false,
            message: `Failed to create process config: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

export default deploymentProcessConfigGenerate