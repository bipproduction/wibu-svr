import { parseNginxToSubdomainJson } from "@/utils/nginx";
import projectEnv from "@/utils/project-env";
import path from "path";
import fs from "fs/promises";

async function domainsConfigLocalFindMany() {
    try {
        const configsLocal = (await fs.readdir(projectEnv.NGINX_CONF_DIR)).filter((file) => file.endsWith(".conf"));
        const listConfigLocal = [];
        for (const config of configsLocal) {
            const configBackup = path.join(projectEnv.NGINX_CONF_DIR, config);
            const file = await fs.readFile(configBackup, "utf-8");
            listConfigLocal.push({
                name: config.split(".")[0],
                ServerConfig: parseNginxToSubdomainJson(file).subdomains,
            });
        }
        return {
            status: 200,
            data: listConfigLocal,
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            data: [],
        }
    }
}

export default domainsConfigLocalFindMany;