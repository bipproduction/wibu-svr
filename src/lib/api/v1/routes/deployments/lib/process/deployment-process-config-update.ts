import { PM2Config } from "@/types/Pm2Config";
import projectConfig from "@/project.config";
import path from "path";
import fs from "fs/promises";
async function deploymentProcessConfigUpdate({ appName, level, type, config }: { appName: string, level: string, type: string, config: PM2Config }) {
    const configPath = path.join(projectConfig.pathPrefix.toConfig(appName), level, type + ".json")
    
    await fs.writeFile(configPath, JSON.stringify(config, null, 2))
    return {
        status: 200,
        success: true,
        message: "Process config updated successfully"
    }   
}

export default deploymentProcessConfigUpdate;