import overviewFindByName from "../../overviews/lib/overview-find";
import fs from "fs/promises";
import path from "path";
import os from "os";
import projectConfig from "@/project.config";
import getRepoSha from "@/utils/get-repo-sha";
import repoClone from "@/utils/repo-clone";
import isDirAlready from "@/utils/is-dir-already";

async function deploymentCreate({ appName, level }: { appName: string, level: string }) {
    try {
        const { data, success } = await overviewFindByName({ appName });
        if (!success) {
            return {
                status: 404,
                success: false,
                message: "overview not found",
            };
        }

        if (!data) {
            return {
                status: 404,
                success: false,
                message: "overview not found",
            };
        }

        const project = data.project;
        const projectLevel = data.project.levels[level as keyof typeof data.project.levels];

        const deploymentPathCurrent = path.resolve(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "deployed", level, "current");
        const deploymentPathRelease = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "deployed", level, "releases");

        await fs.mkdir(deploymentPathCurrent, { recursive: true });
        await fs.mkdir(deploymentPathRelease, { recursive: true });

        const sha = await getRepoSha({ repo: project.repository, branch: projectLevel.branch });

        if (!sha) {
            return {
                status: 400,
                success: false,
                message: "failed to get sha",
            };
        }

        const isDirReleaseAlready = await isDirAlready({ dir: path.join(deploymentPathRelease, sha) });
        if (isDirReleaseAlready) {
            return {
                status: 400,
                success: false,
                message: "deployment already exists",
            };
        }

        const { success: successClone, message: messageClone } = await repoClone({ repo: project.repository, branch: projectLevel.branch, dir: path.join(deploymentPathRelease, sha) });
        if (!successClone) {
            return {
                status: 400,
                success: false,
                message: messageClone,
            };
        }

        return {
            status: 200,
            success: true,
            message: "deployment created",
        };
    } catch (error) {
        return {
            status: 400,
            success: false,
            message: error
        }
    }
}

export default deploymentCreate;