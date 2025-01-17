import prisma from '@/lib/prisma';
import projectEnv from '@/utils/project-env'
import { spawn } from 'child_process'
import path from 'path'


const PROCESS_TIMEOUT = 600000; // 10 menit
async function projectPromote({ projectId, commitId, envGroupId }: { projectId: string, commitId: string, envGroupId: string }): Promise<{ success: boolean, message: string }> {

    return new Promise(async (resolve, reject) => {
        const envGroup = await prisma.envGroup.findUnique({
            where: {
                id: envGroupId
            }
        })
        if (!envGroup || !envGroup.name) {
            reject({
                success: false,
                message: 'Env group not found'
            })
        }
        const sourcePath = path.join(projectEnv.PROJECTS_DIR, projectId, 'releases', commitId)
        const targetPath = path.join(projectEnv.PROJECTS_DIR, projectId, envGroup!.name)
        const child = spawn('/bin/bash', ['-c', `ln -sf ${sourcePath} ${targetPath}`], {
            timeout: PROCESS_TIMEOUT
        })

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`)
        })

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`)
        })

        child.on('close', async (code) => {
            if (code === 0) {
                await prisma.promoteHistory.upsert({
                    where: {
                        projectId_commitId_envGroupId: {
                            projectId,
                            commitId,
                            envGroupId
                        }
                    },
                    create: {
                        projectId,
                        commitId,
                        envGroupId
                    },
                    update: {}
                }).catch((error) => {
                    reject({
                        success: false,
                        message: error.message
                    })
                })
                resolve({
                    success: true,
                    message: 'Promote success'
                }) // Sukses
            } else {
                reject({
                    success: false,
                    message: `Command failed with exit code ${code}`
                }) // Gagal
            }
        })

        child.on('error', (error) => {
            reject({
                success: false,
                message: error.toString()
            }) // Menangani kesalahan saat spawn
        })
    })
}

export default projectPromote