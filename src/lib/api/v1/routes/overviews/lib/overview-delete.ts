import path from "path";
import projectConfig from "@/project.config";
import fs from "fs/promises";
import os from "os";
import overviewFindMany from "./overview-find-many";

async function overviewDelete({ appName }: { appName: string }) {
    try {
        const overviewPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.overviews);
        await fs.unlink(path.join(overviewPath, appName + projectConfig.fileExtension));
        const overviews = await overviewFindMany();
        return {
            status: 200,
            success: true,
            message: "success delete overview",
            data: overviews.data,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            success: false,
            message: "failed delete overview",
        };
    }
}

export default overviewDelete;
