/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path"
import fs from "fs/promises"
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)
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
            throw new Error(`Failed to clone repository: ${error.message}`)
        })
    }
    return targetDir
}

export default cloneRepository