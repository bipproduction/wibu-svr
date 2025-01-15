/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import projectConfig from "@/project.config";
import fs from "fs/promises";
import os from "os";
async function overviewCreate({ data }: { data: Record<string, any> }) {

    try {
        // Validasi nama proyek
        if (!data.project?.name) {
            console.log("Project name is required");
            return {
                status: 400,
                success: false,
                message: "Project name is required",
            };
        }

        // Konstruksi path sekali saja
        const overviewPath = path.join(
            os.homedir(), 
            projectConfig.projectRootDir, 
            projectConfig.pathPrefix.overviews
        );
        const fileName = `${data.project.id}${projectConfig.fileExtension}`;
        const fullPath = path.join(overviewPath, fileName);

        await fs.mkdir(overviewPath, { recursive: true });
        await fs.writeFile(fullPath, JSON.stringify(data, null, 2));

        return {
            status: 200,
            success: true,
            message: "Success creating overview",
            data: { path: fullPath },
        };
    } catch (error) {
        console.log(error);
        // Improved error handling
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        return {
            status: 500,
            success: false,
            message: `Failed to create overview: ${errorMessage}`,
            error: error,
        };
    }
}

export default overviewCreate;
