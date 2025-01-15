import os from "os";
import path from "path";
import fs from "fs/promises";
import projectConfig from "@/project.config";

async function deploymentReleaseFindMany({ appName, level }: { appName: string; level: string }) {
    try {
        const rootDir = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments);
        const deploymentDir = path.join(rootDir, "apps", appName, "deployed", level, "releases");
        const releases = (await fs.readdir(deploymentDir)).map((release) => ({
            appName,
            level,
            release,
        }));

        return {
            status: 200,
            message: "Success",
            data: releases,
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Internal Server Error",
            error: error,
        };
    }
}

export default deploymentReleaseFindMany;