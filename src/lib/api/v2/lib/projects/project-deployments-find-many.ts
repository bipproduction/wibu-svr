import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/prisma";
import projectEnv from "@/utils/project-env";

async function projectDeploymentsFindMany({ projectId }: { projectId: string }) {

    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })
    if (!project) {
        return {
            status: 404,
            message: "Project not found",
            data: []
        }
    }
    const releasesPath = path.join(projectEnv.PROJECTS_DIR, project.id, "releases")
    const deployments = await fs.readdir(releasesPath)

    const commits = await prisma.commit.findMany({
        where: {
            projectId: projectId,
            id: {
                in: deployments
            }
        },
        include: {
            branch: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    const deplymentHistory = await prisma.deployHistory.findMany({
        where: {
            projectId: projectId,
            commitId: {
                in: deployments
            }
        }
    })

    const commitWithDeploymentHistory = commits.map((commit) => {
        const deploymentHistory = deplymentHistory.find((history) => history.commitId === commit.id)
        return {
            ...commit,
            isSuccess: !deploymentHistory ? null : deploymentHistory.isSuccess
        }
    })
    return {
        status: 200,
        message: "Deployments found",
        data: commitWithDeploymentHistory
    }
}

export default projectDeploymentsFindMany;
