import prisma from "@/lib/prisma"
import path from "path"
import fs from "fs/promises"
import projectEnv from "@/utils/project-env"

async function projectBranchFindMany({ projectId }: { projectId: string }) {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            },
            include: {
                ProjectCommit: {
                    include: {
                        envGroup: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        commit: {
                            select: {
                                id: true,
                                sha: true,
                                message: true,
                                author: true,
                                date: true
                            }
                        }
                    }
                }
            }
        })
        if (!project) {
            return {
                status: 404,
                message: "Project not found",
                data: []
            }
        }
        const listRelease = await fs.readdir(path.join(projectEnv.PROJECTS_DIR, project.id, "releases"))
        const branches = await prisma.branch.findMany({
            where: {
                projectId: projectId
            },
            select: {
                id: true,
                name: true,
                sha: true

            }
        })


        const projectCommit = (sha: string) => project.ProjectCommit.map((commit) => {
            return {
                envGroup: commit.envGroup,
                commit: commit.commit,
                hasPromote: commit.commitId === sha ? true : false
            }
        })
        // branch has release
        const branchesHasRelease = branches.map((branch) => {
            return {
                ...branch,
                hasRelease: listRelease.includes(branch.sha!),
                promote: projectCommit(branch.sha!)
            }
        })

        return {
            status: 200,
            message: "Success",
            data: branchesHasRelease
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "Internal server error"
        }
    }
}

export default projectBranchFindMany