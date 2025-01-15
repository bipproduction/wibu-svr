import prisma from "@/lib/prisma"
import projectEnv from "@/utils/project-env"
import fs from "fs/promises"
import path from "path"

async function projectCommitFindMany({ projectId }: { projectId: string }) {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })

    if (!project) {
        return {
            status: 404,
            data: null
        }
    }

    const releasesDir = path.join(projectEnv.PROJECTS_DIR, project.id, "releases")
    const releases = await fs.readdir(releasesDir)
    const res = await prisma.commit.findMany({
        where: {
            projectId
        }
    })

    const commitHasReleases = res.map((commit) => {
        return {
            ...commit,
            hasRelease: releases.includes(commit.sha)
        }
    }).sort((a, b) => {
        // sort by hasRelease, then by date
        if (a.hasRelease && !b.hasRelease) {
            return -1
        } else if (!a.hasRelease && b.hasRelease) {
            return 1
        } else {
            return new Date(b.date!).getTime() - new Date(a.date!).getTime()
        }
    })

    return {
        status: 200,
        data: commitHasReleases
    }
}

export default projectCommitFindMany;