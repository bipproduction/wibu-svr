import prisma from "@/lib/prisma"
import EnvStringParser from "@/utils/env-string-parse"
import projectEnv from "@/utils/project-env"
import { spawn } from "child_process"
import path from "path"
import DeployLog from "../DeployLog"

// Tambahkan konstanta untuk timeout
const PROCESS_TIMEOUT = 600000; // 10 menit

async function cloneProject({ releasesPath, commitId, repository }: { releasesPath: string, commitId: string, repository: string }) {
    DeployLog.info(commitId, "❗", "Start clone project")
    return new Promise((resolve, reject) => {
        const child = spawn('git', ['clone', repository, commitId], {
            cwd: releasesPath,
            timeout: PROCESS_TIMEOUT
        })
        child.stdout.on('data', (data) => {
            DeployLog.info(commitId, data.toString())
        })

        child.stderr.on('data', (data) => {
            DeployLog.setWarn(commitId, data.toString())
        })

        child.on('error', (error) => {
            DeployLog.error(commitId, error.toString())
            reject(error)
        })

        child.on('close', () => {
            DeployLog.info(commitId, "✅", "Clone project success")
            resolve({
                success: true,
                message: "Clone project success"
            })
        })
    })

}

async function checkoutCommit({ commitId, cwd }: { commitId: string, cwd: string }) {
    DeployLog.info(commitId, "🔍", "Start checkout commit")
    return new Promise((resolve, reject) => {
        const child = spawn('git', ['checkout', commitId], {
            cwd,
            timeout: PROCESS_TIMEOUT
        })
        child.stdout.on('data', (data) => {
            DeployLog.info(commitId, data.toString())
        })

        child.stderr.on('data', (data) => {
            DeployLog.setWarn(commitId, data.toString())
        })

        child.on('error', (error) => {
            DeployLog.error(commitId, error.toString())
            reject(error)
        })
        child.on('close', () => {
            DeployLog.info(commitId, "✅", "Checkout commit success")
            resolve({
                success: true,
                message: "Checkout commit success"
            })
        })
    })
}

async function installDependencies({ commitId, cwd }: { commitId: string, cwd: string }) {
    DeployLog.info(commitId, "🔍", "Mulai instalasi dependencies")
    return new Promise((resolve, reject) => {
        const child = spawn('/bin/bash', ['-c', 'bun install'], {
            env: {
                ...process.env,
                NODE_ENV: 'production'
            },
            cwd,
            timeout: PROCESS_TIMEOUT
        })
        child.stdout.on('data', (data) => {
            DeployLog.info(commitId, data.toString())
        })

        child.stderr.on('data', (data) => {
            DeployLog.setWarn(commitId, data.toString())
        })

        child.on('error', (error) => {
            DeployLog.error(commitId, error.toString())
            reject(error)
        })
        child.on('close', () => {
            DeployLog.info(commitId, "✅", "Install dependencies success")
            resolve({
                success: true,
                message: "Dependencies installed"
            })
        })
    })
}


async function runMigrations({ commitId, cwd, envObj }: { commitId: string, cwd: string, envObj: Record<string, string> }) {
    DeployLog.info(commitId, "🔍", "Start run migrations")
    return new Promise((resolve, reject) => {
        const child = spawn('/bin/bash', ['-c', 'source ~/.nvm/nvm.sh && $(which bunx) prisma db push'], {
            env: {
                ...envObj,
                NODE_ENV: 'production'
            },
            cwd,
            timeout: PROCESS_TIMEOUT
        })
        child.stdout.on('data', (data) => {
            DeployLog.info(commitId, data.toString())
        })

        child.stderr.on('data', (data) => {
            DeployLog.setWarn(commitId, data.toString())
        })

        child.on('error', (error) => {
            DeployLog.error(commitId, error.toString())
            reject(error)
        })
        child.on('close', () => {
            DeployLog.info(commitId, "✅", "Run migrations success")
            resolve({
                success: true,
                message: "Migrations run"
            })
        })
    })
}

async function getCommit({ commitId }: { commitId: string }) {
    DeployLog.info(commitId, "🔍", "Start get commit")
    const commit = await prisma.commit.findUnique({
        where: { id: commitId },
        include: {
            project: true
        }
    })
    DeployLog.info(commitId, "✅", "Get commit success")
    return commit
}


async function getEnvObject({ projectId, commitId }: { projectId: string, commitId: string }) {
    DeployLog.info(commitId, "🔍", "Start get env object")
    const envDep = await prisma.envItem.findUnique({
        where: {
            projectId_envGroupId: {
                projectId,
                envGroupId: 'development'
            }
        }
    })
    const envObj = EnvStringParser.parse(envDep?.text as string)
    DeployLog.info(commitId, "✅", "Get env object success")
    return envObj
}

async function buildProject({ commitId, cwd, envObj }: { commitId: string, cwd: string, envObj: Record<string, string> }) {
    DeployLog.info(commitId, "🔍", "Start build project")
    return new Promise((resolve, reject) => {
        const child = spawn('/bin/bash', ['-c', 'source ~/.nvm/nvm.sh && $(which nice) -n 19 $(which bun) run build'], {
            env: {
                ...envObj,
                NODE_ENV: 'production',
                WEBPACK_CACHE_SERIALIZATION: 'buffer',
                WEBPACK_CACHE_COMPRESSION: 'true'
            },
            cwd,
            timeout: PROCESS_TIMEOUT,
        })
        child.stdout.on('data', (data) => {
            DeployLog.info(commitId, data.toString())
        })

        child.stderr.on('data', (data) => {
            DeployLog.setWarn(commitId, data.toString())
        })

        child.on('error', (error) => {
            DeployLog.error(commitId, error.toString())
            reject(error)
        })
        child.on('close', () => {
            DeployLog.info(commitId, "✅", "Build project success")
            resolve({
                success: true,
                message: "Build project success"
            })
        })
    })
}

async function runDeploy({ commitId }: { commitId: string }) {
    DeployLog.isLog = false
    const commit = await getCommit({ commitId })
    if (!commit) {
        DeployLog.error(commitId, "Commit tidak ditemukan")
        return {
            success: false,
            message: 'Commit tidak ditemukan'
        }
    }

    //  collect data parameters
    const releasesPath = path.join(projectEnv.PROJECTS_DIR, commit.projectId, 'releases')
    const cwd = path.join(releasesPath, commitId)
    const envObj = await getEnvObject({ projectId: commit.projectId, commitId: commit.id })

    // start deploy
    try {
        await cloneProject({ releasesPath, commitId: commit.id, repository: commit.project.repository });
        await checkoutCommit({ commitId: commit.id, cwd });
        await installDependencies({ commitId: commit.id, cwd });
        await runMigrations({ commitId: commit.id, cwd, envObj });
        await buildProject({ commitId: commit.id, cwd, envObj });

        const log = DeployLog.getLog(commitId)
        console.log("========== SAVE LOG ==========")
        console.log(log, "log")
        await prisma.buildLog.upsert({
            where: {
                projectId_commitId: {
                    projectId: commit.projectId,
                    commitId
                }
            },
            update: {
                status: "SUCCESS",
                stringLog: log.join("\n"),
                jsonLog: log
            },
            create: {
                projectId: commit.projectId,
                commitId: commit.id,
                status: "SUCCESS",
                stringLog: log.join("\n"),
                jsonLog: log
            }
        })

        await prisma.deployHistory.upsert({
            where: {
                projectId_commitId: {
                    projectId: commit.projectId,
                    commitId: commit.id
                }
            },
            create: {
                isSuccess: true,
                commitId: commit.id,
                projectId: commit.projectId,
            },
            update: {
                isSuccess: true
            }
        })

    } catch (error) {
        console.log(error, "error")
        DeployLog.error(commitId, `Deploy gagal: ${error}`);
        await prisma.buildLog.upsert({
            where: {
                projectId_commitId: {
                    projectId: commit.projectId,
                    commitId: commit.id
                }
            },
            update: { status: "FAILED" },
            create: { projectId: commit.projectId, commitId: commit.id, status: "FAILED" }
        })

        await prisma.deployHistory.upsert({
            where: {
                projectId_commitId: {
                    projectId: commit.projectId,
                    commitId: commit.id
                }
            },
            create: {
                isSuccess: false,
                commitId: commit.id,
                projectId: commit.projectId,
            },
            update: {
                isSuccess: false
            }
        })
    } finally {
        console.log("========== CLEAR LOG ==========")
        DeployLog.clearLog(commitId)
    }
}

async function projectDeploy({ commitId }: { commitId: string }) {
    const isLogRunning = DeployLog.isLogRunning(commitId)
    if (isLogRunning) {
        return {
            success: false,
            message: 'Deploy already running'
        }
    }
    runDeploy({ commitId })
    return {
        success: true,
        message: 'Project deployed running in background ...',
    }
}

export default projectDeploy