
import { execSync } from 'child_process'
import path from 'path'
import projectConfig from '@/project.config'
import os from 'os'

async function treeView() {
    const dir = path.resolve(os.homedir(), projectConfig.projectRootDir)
    const tree = execSync(`tree -L 7 -I "node_modules|dist|build|public|static|uploads|logs|tmp|cache|sessions" ${dir}`, {
        encoding: 'utf-8',
        env: {
            ...process.env,
            LANG: 'en_US.UTF-8'
        }
    })
    return tree
}

export default treeView;