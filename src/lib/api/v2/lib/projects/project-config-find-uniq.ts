/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import path from "path";
import projectEnv from "@/utils/project-env";
import fs from "fs/promises";

async function projectConfigFindUniq({ projectId }: { projectId: string }) {
    const envGroup = await prisma.envGroup.findMany()

    const configs = await new Promise<string[]>(async (resolve, reject) => {
        try {
            const configPath = path.join(projectEnv.PROJECTS_DIR, projectId, "configs")
            await fs.access(configPath)
            const configFiles = await fs.readdir(configPath)
            const config = configFiles.map(file => file.split(".")[0])
            resolve(config)
        } catch (error) {
            resolve([])
        }
    })

    const dataResult = envGroup.map(envGroup => {
        const config = configs.find(config => config === envGroup.id)
        return {
            ...envGroup,
            hasConfig: config ? true : false
        }
    })

    return {
        data: dataResult
    }
}

export default projectConfigFindUniq