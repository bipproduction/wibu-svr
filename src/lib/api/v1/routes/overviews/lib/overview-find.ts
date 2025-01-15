import path from "path";
import projectConfig from "@/project.config";
import fs from "fs/promises";
import os from "os";
import { Overview } from "@/types/Overview";

async function overviewFind({ appName }: { appName: string }) {
    try {
        const overviewPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.overviews);
        const overview = await fs.readFile(path.join(overviewPath, appName + projectConfig.fileExtension), "utf-8");
        const jsonOverview: Overview = JSON.parse(overview);
        return {
            status: 200,
            success: true,
            message: "success find overview",
            data: jsonOverview,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            success: false,
            message: "failed find overview",
        };
    }
}

export default overviewFind;