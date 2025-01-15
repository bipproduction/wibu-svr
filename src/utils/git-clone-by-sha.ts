import { exec } from "child_process";
import { promisify } from 'util';
const execPromise = promisify(exec)
import path from "path";
import prisma from "@/lib/prisma";
import projectEnv from "./project-env";

async function gitCloneBySha({ sha }: { sha: string, }) {
    try {
        const commit = await prisma.commit.findUnique({
            where: { id: sha },
            include: {
                project: true
            }
        })
        if (!commit) {
            throw new Error('Commit not found')
        }
        const releases = path.join(projectEnv.PROJECTS_DIR, commit.project.id, 'releases')
        const res = await execPromise(`git clone ${commit.project.repository} ${commit.sha}`, {
            cwd: releases,
            timeout: 600000
        })

        return {
            success: true,
            message: res
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

export default gitCloneBySha