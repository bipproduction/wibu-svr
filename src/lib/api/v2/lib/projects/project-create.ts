/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)
import prisma from '@/lib/prisma'
import EnvStringParser from '@/utils/env-string-parse'
import projectEnv from '@/utils/project-env'
import fs from 'fs/promises'
import path from 'path'

// Types
type TypeBody = {
    name: string,
    repository: string,
    envVariables: string
}

type DeployOptions = {
    projectName: string
    repository: string
    projectId: string
    envVariables: string
}

type SymlinkOperation = {
    name: string
    source: string
    target: string
}

// Error Handling
class DeployError extends Error {
    constructor(message: string, public step: string, public originalError?: unknown) {
        super(message)
        this.name = 'DeployError'
    }
}

// Utility Functions
function validateRepository(repository: string | null | undefined): repository is string {
    if (!repository) return false
    const gitUrlPattern = /^(https?:\/\/|git@)([^\s:]+)(:|\/)[^\s]+$/
    return gitUrlPattern.test(repository)
}

// Cleanup Functions
async function cleanup(projectDir: string, sha?: string) {
    console.log(`🧹 Cleaning up ${projectDir}...`)
    try {
        if (sha) {
            const releaseDir = path.join(projectDir, 'releases', sha)
            await fs.rm(releaseDir, { recursive: true, force: true })
        }
        await fs.unlink(path.join(projectDir, 'preview')).catch(() => { })
    } catch (error) {
        console.error('Cleanup error:', error)
    }
}

async function getLatestCommitSha({ url, branch }: { url: string, branch: string }) {
    const cleanUrl = url.startsWith('@') ? url.substring(1) : url;

    // Regex untuk mengekstrak owner dan repo dari berbagai format URL
    const regex = /(?:https?:\/\/github\.com\/|git@github\.com:|^)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = cleanUrl.match(regex);

    if (!match) {
        throw new Error(`URL repository tidak valid: ${cleanUrl}`);
    }

    const owner = match[1];
    const repository = match[2].replace('.git', '');
    const apiUrl = `https://api.github.com/repos/${owner}/${repository}/branches`;

    console.log("fetching branches")
    const response = await fetch(apiUrl, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.status} ${response.statusText}`);
    }

    const data: { name: string, commit: { sha: string } }[] = await response.json();
    return data.find(v => v.name === branch)?.commit.sha
}

// Deployment Operations
async function setupProjectDirectory(projectDir: string, releasesDir: string) {
    console.log(`📁 Creating project directory: ${projectDir}`)
    await fs.mkdir(releasesDir, { recursive: true })
}

async function cloneRepository(repository: string, sha: string, releasesDir: string) {
    const targetDir = path.join(releasesDir, sha)
    console.log(`📥 Cloning repository at ${sha}`)
    // check if directory already exists
    try {
        await fs.access(targetDir)
        console.log(`📁 Directory ${targetDir} already exists, skipping...`)
    } catch (error) {
        console.log(`📁 Directory ${targetDir} does not exist, cloning...`)
        await execAsync(`git clone -b main ${repository} ${sha}`, {
            cwd: releasesDir,
            timeout: 600000
        }).catch(error => {
            throw new DeployError('Failed to clone repository', 'git_clone', error)
        })
    }
    return targetDir
}

async function installDependencies(targetDir: string) {
    console.log('📦 Installing dependencies')
    await execAsync(`bun install`, {
        env: {
            ...process.env,
            NODE_ENV: 'production'
        },
        cwd: targetDir
    }).catch(error => {
        throw new DeployError('Failed to install dependencies', 'install_deps', error)
    })
}

async function runMigrations(targetDir: string, envObj: Record<string, string>) {
    console.log('🔄 Running database migrations')
    await execAsync(`source ~/.nvm/nvm.sh && $(which bunx) prisma db push`, {
        env: {
            ...envObj,
            NODE_ENV: 'production'
        },
        cwd: targetDir,
        timeout: 600000
    }).catch(error => {
        throw new DeployError('Failed to run database migrations', 'db_migration', error)
    })
}

async function buildProject(targetDir: string, envObj: Record<string, string>) {
    console.log('🏗️ Building project')
    await execAsync(`source ~/.nvm/nvm.sh && $(which nice) -n 19 $(which bun) run build`, {
        env: {
            ...envObj,
            NODE_ENV: 'production'
        },
        cwd: targetDir,
        timeout: 600000
    }).catch(error => {
        throw new DeployError('Failed to build project', 'build', error)
    })
}

async function setupSymlinks(operations: SymlinkOperation[]) {
    console.log('🔗 Setting up symlinks')
    for (const op of operations) {
        await fs.unlink(op.target).catch(() => { })
        await fs.symlink(op.source, op.target)
            .catch(error => {
                throw new DeployError(`Failed to create ${op.name} symlink`, 'symlink', error)
            })
    }
}

// Main Deploy Function
async function deploy({ projectName, repository, projectId, envVariables }: DeployOptions) {
    if (!validateRepository(repository)) {
        throw new DeployError('Invalid repository URL format', 'validation')
    }

    const projectDir = path.join(projectEnv.PROJECTS_DIR, projectName)
    const releasesDir = path.join(projectDir, 'releases')
    const latestCommit = await getLatestCommitSha({ url: repository, branch: 'main' })
    if (!latestCommit) {
        throw new DeployError('Failed to get latest commit', 'get_latest_commit')
    }
    try {
        await setupProjectDirectory(projectDir, releasesDir)

        const targetDir = await cloneRepository(repository, latestCommit, releasesDir)
        await installDependencies(targetDir)

        const envObj = EnvStringParser.parse(envVariables)
        await runMigrations(targetDir, envObj)
        await buildProject(targetDir, envObj)

        const symlinkOperations: SymlinkOperation[] = [
            {
                name: 'preview',
                source: path.join(releasesDir, latestCommit),
                target: path.join(projectDir, 'preview')
            },
            {
                name: 'production',
                source: path.join(releasesDir, latestCommit),
                target: path.join(projectDir, 'production')
            }
        ]

        await setupSymlinks(symlinkOperations)

        // Update project commits dengan error handling yang lebih baik
        console.log(`🔄 Updating project commit for ${projectId} ${latestCommit} in production`)
        await prisma.projectCommit.upsert({
            where: {
                projectId_envGroupId_commitId: {
                    projectId: projectId,
                    envGroupId: 'production',
                    commitId: latestCommit
                }
            },
            update: {
                commitId: latestCommit
            },
            create: {
                projectId: projectId,
                commitId: latestCommit,
                envGroupId: 'production'
            }
        }).catch(error => {
            console.error('❌ Failed to update project commit for production:', error)
            throw new DeployError('Failed to update project commit for production', 'update_project_commit', error)
        })

        console.log(`✅ Updated project commit for ${projectId} in preview`)

        await prisma.projectCommit.upsert({
            where: {
                projectId_envGroupId_commitId: {
                    projectId: projectId,
                    envGroupId: 'preview',
                    commitId: latestCommit
                }
            },
            update: {
                commitId: latestCommit
            },
            create: {
                id: latestCommit,
                projectId: projectId,
                commitId: latestCommit,
                envGroupId: 'preview'
            }
        })

        console.log('✅ Build completed successfully and project commit updated')
        return {
            sha: latestCommit,
            message: "success"
        }
    } catch (error) {
        console.error('❌ Deployment failed:', error)
        try {
            await cleanup(projectDir, latestCommit)
        } catch (cleanupError) {
            console.error('❌ Cleanup failed:', cleanupError)
        }
        throw error
    }
}

async function insertBranch({ projectId, url }: { projectId: string, url: string }) {
    const cleanUrl = url.startsWith('@') ? url.substring(1) : url;

    // Regex untuk mengekstrak owner dan repo dari berbagai format URL
    const regex = /(?:https?:\/\/github\.com\/|git@github\.com:|^)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = cleanUrl.match(regex);

    if (!match) {
        throw new Error(`URL repository tidak valid: ${cleanUrl}`);
    }

    const owner = match[1];
    const repository = match[2].replace('.git', '');
    const apiUrl = `https://api.github.com/repos/${owner}/${repository}/branches`;

    console.log("fetching branches")
    const response = await fetch(apiUrl, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.status} ${response.statusText}`);
    }

    const data: { name: string, commit: { sha: string } }[] = await response.json();
    console.log("inserting branches")
    for (const branch of data) {
        await prisma.branch.upsert({
            where: {
                projectId_name: {
                    projectId: projectId,
                    name: branch.name
                }
            },
            update: {
                sha: branch.commit.sha
            },
            create: {
                name: branch.name,
                projectId: projectId,
                sha: branch.commit.sha
            }
        })
    }
    console.log("inserting branches success")
}

async function insertCommit({ url, branch, projectId }: { url: string, branch: string, projectId: string }) {
    const branchData = await prisma.branch.findUnique({
        where: {
            name: branch,
            projectId_name: {
                projectId: projectId,
                name: branch
            }
        }
    })
    if (!branchData) {
        throw new Error(`Branch ${branch} not found`)
    }
    // Hapus @ dari awal URL jika ada
    const cleanUrl = url.startsWith('@') ? url.substring(1) : url;

    // Regex untuk mengekstrak owner dan repo dari berbagai format URL
    const regex = /(?:https?:\/\/github\.com\/|git@github\.com:|^)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = cleanUrl.match(regex);

    if (!match) {
        throw new Error(`URL repository tidak valid: ${cleanUrl}`);
    }

    const owner = match[1];
    const repository = match[2].replace('.git', '');

    // Gunakan branch yang diberikan dalam URL API
    const apiUrl = `https://api.github.com/repos/${owner}/${repository}/commits?sha=${branch}`;

    console.log("Mengakses URL API:", apiUrl);
    console.log("Repository:", `${owner}/${repository}`);
    console.log("Branch:", branch);

    const response = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GithubApp'
        }
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Response body:", errorBody);
        console.error("URL yang diakses:", apiUrl);
        throw new Error(`Gagal mengambil commits: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const commits: any[] = data.map((commit: any) => ({
        sha: commit.sha,
        author: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
        message: commit.commit.message,
        url: commit.html_url,
        branch: branch
    }));

    for (const commit of commits) {
        await prisma.commit.upsert({
            where: { id: commit.sha },
            update: {},
            create: {
                id: commit.sha,
                projectId,
                sha: commit.sha,
                author: commit.author,
                email: commit.email,
                date: commit.date,
                message: commit.message,
                url: commit.url,
                branchId: branchData.id
            }
        })
    }

}

// Main Project Creation Function
async function projectCreate({ body }: { body: TypeBody }) {
    const errors: string[] = []
    if (!body.name?.trim()) errors.push('Project name is required')
    if (!body.repository?.trim()) errors.push('Repository URL is required')
    if (!body.envVariables?.trim()) errors.push('Environment variables are required')
    if (body.repository && !validateRepository(body.repository)) errors.push('Invalid repository URL format')


    if (errors.length > 0) {
        console.error('❌ Invalid request body:', errors)
        return {
            status: 400,
            message: 'Invalid request body',
            errors
        }
    }


    console.log('🔍 Inserting project data')
    const project = await prisma.project.upsert({
        where: { repository: body.repository },
        update: {},
        create: {
            name: body.name,
            repository: body.repository
        }
    }).catch((error) => {
        console.error('❌ Project creation failed:', error)
        throw new Error('Project creation failed')
    })

    // insert branch
    console.log("inserting branch")
    await insertBranch({ projectId: project.id, url: body.repository })
    console.log("inserting branch success")
    console.log("inserting commit")
    await insertCommit({ url: body.repository, branch: 'main', projectId: project.id })
    console.log("inserting commit success")

    const envGroups = await prisma.envGroup.findMany()
    console.log("envGroup", envGroups)

    if (envGroups.length === 0) {
        console.error('❌ Env group production not found')
        throw new Error('Env group production not found')
    }

    for (const env of envGroups) {
        // insert env production
        console.log("inserting env production")
        await prisma.envItem.upsert({
            where: {
                projectId_envGroupId: {
                    projectId: project.id,
                    envGroupId: env.id
                }
            },
            update: {
                text: body.envVariables
            },
            create: {
                text: body.envVariables,
                projectId: project.id,
                envGroupId: env.id
            }
        })
    }

    console.log("inserting env production success")

    if (!project.repository) {
        console.error('❌ Project creation failed because repository is required')
        return {
            status: 500,
            message: 'Repository is required for deployment'
        }
    }

    console.log(`📦 Starting deployment for project: ${body.name}`)
    const deployResult = await deploy({
        projectName: project.id,
        repository: project.repository,
        projectId: project.id,
        envVariables: body.envVariables
    })

    return {
        status: 200,
        message: 'Project created and deployed successfully',
        data: {
            ...project,
            deployment: deployResult
        }
    }
}





export default projectCreate;
