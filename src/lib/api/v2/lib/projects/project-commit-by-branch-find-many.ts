import prisma from "@/lib/prisma";
import projectEnv from "@/utils/project-env";
import fs from "fs/promises";
import path from "path";

async function projectCommitByBranchFindMany({ projectId, branchId }: { projectId: string; branchId: string }) {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })

    if (!project) {
        return {
            data: [],
            status: 404
        }
    }

    const commits = await prisma.commit.findMany({
        where: {
            projectId,
            branchId
        }
    })

    const releasesDir = path.join(projectEnv.PROJECTS_DIR, project.id, "releases");
    const releases = await fs.readdir(releasesDir);
    const commitsHasRelease = commits.map((commit) => {
        const release = releases.find((release) => release.includes(commit.sha));
        return {
            ...commit,
            hasRelease: !!release
        };
    });
    return {
        data: commitsHasRelease,
        status: 200
    }
}

export default projectCommitByBranchFindMany