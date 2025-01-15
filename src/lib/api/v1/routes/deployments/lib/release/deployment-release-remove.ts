import path from "path";
import projectConfig from "@/project.config";
import fs from "fs/promises";
import os from "os";

async function deploymentReleaseRemove({ appName, level, release }: { appName: string, level: string, release: string }) {
    const deploymentReleasePath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "deployed", level, "releases", release);
    await fs.rm(deploymentReleasePath, { recursive: true });
    return {
        status: 200,
        success: true,
        message: "deployment release deleted",
    }
}

export default deploymentReleaseRemove