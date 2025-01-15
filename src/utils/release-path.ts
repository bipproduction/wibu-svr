import path from "path";
import projectConfig from "../project.config";
import os from "os";

function releasePath({ appName, level }: { appName: string, level: string }) {
    const deploymentPathRelease = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "deployed", level, "releases");
    return deploymentPathRelease
}

export default releasePath