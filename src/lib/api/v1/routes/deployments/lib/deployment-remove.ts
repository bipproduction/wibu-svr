import path from "path";
import projectConfig from "@/project.config";
import fs from "fs/promises";
import os from "os";

async function deploymentRemove({ appName }: { appName: string }) {
    try {
        const deploymentReleasePath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName);
        await fs.rm(deploymentReleasePath, { recursive: true });
        return {
            status: 200,
            success: true,
            message: "deployment release deleted",
        }
    } catch (error) {
        return {
            status: 400,
            success: false,
            message: error
        }
    }
}

export default deploymentRemove