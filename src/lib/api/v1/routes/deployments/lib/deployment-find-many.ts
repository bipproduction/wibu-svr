import fs from "fs/promises";
import path from "path";
import os from "os";
import projectConfig from "@/project.config";

async function deploymentFindMany() {
    try {
        const deploymentPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps")
    let listDir = await fs.readdir(deploymentPath) 

    // eliminate .DS_Store
    listDir = listDir.filter((item) => item !== ".DS_Store");

    return {
        status: 200,
            success: true,
            message: "success find many deployment",
            data: listDir
        };
    } catch (error) {
        return {
            status: 400,
            success: false,
            message: error
        };
    }
}

export default deploymentFindMany;
