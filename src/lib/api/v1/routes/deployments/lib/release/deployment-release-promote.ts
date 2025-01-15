import path from "path";
import os from "os";
import projectConfig from "@/project.config";
import fs from "fs/promises";

const availableType = ["main", "preview"]
async function deploymentReleasePromote({ appName, level, type, release }: { appName?: string, level?: string, type?: string, release?: string }) {
    try {

        if (!appName || !level || !type || !release) {
            return {
                status: 400,
                success: false,
                message: "name, level, type, and release are required "
            }
        }
        if (!availableType.includes(type)) {
            return {
                status: 400,
                success: false,
                message: `type ${type} is not available, available type: ${availableType.join(", ")}`
            }
        }
        const deploymentPathCurrent = path.resolve(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "deployed", level, "current");
        const deploymentPathRelease = path.resolve(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "deployed", level, "releases", release);

        await fs.unlink(path.resolve(deploymentPathCurrent, type)).catch(() => { });
        await fs.symlink(deploymentPathRelease, path.resolve(deploymentPathCurrent, type));
        return {
            status: 200,
            success: true,
            message: `${release} promoted to ${type}`
        }
    } catch (error) {
        return {
            status: 500,
            success: false,
            message: "Failed to promote release"
        }
    }
}

export default deploymentReleasePromote;