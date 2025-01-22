import path from "path";
import fs from "fs/promises";
import projectEnv from "@/utils/project-env";
import moment from "moment";

async function serverBackupConfig({ name, }: { name: string }) {
    try {
        const configPath = path.join(projectEnv.NGINX_CONF_DIR, name + ".conf");
        const configBackupPath = path.join(projectEnv.NGINX_CONF_DIR, "backups");
        const configBackupfile = path.join(configBackupPath, name + "_" + moment().format("YYYY-MM-DD_HH-mm-ss") + ".bak");
        await fs.mkdir(path.dirname(configBackupPath), { recursive: true });
        await fs.copyFile(configPath, configBackupfile);
        return {
            success: true,
            status: 200,
            message: "Config backup created successfully"
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: 500,
            message: "Failed to create config backup",
            error: error,
        };
    }

}

export default serverBackupConfig;