import os from "os";
import path from "path";
import projectConfig from "@/project.config";
import fs from "fs/promises";

const overviewFindMany = async () => {
    try {
        const overviewPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.overviews);
        const overviews = await fs.readdir(overviewPath);
        const overviewsData = overviews.map((overview) => overview.replace(projectConfig.fileExtension, ""));
        return {
            status: 200,
            success: true,
            message: "success find overviews",
            data: overviewsData,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            success: false,
            message: "failed find overviews",
        };
    }
};

export default overviewFindMany;
