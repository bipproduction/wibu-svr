import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';
import os from 'os';

dotenv.config();

const PROJECT_ROOT_DIR = process.env.PROJECT_ROOT_DIR
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL

if (!PROJECT_ROOT_DIR) {
    throw new Error("PROJECT_ROOT_DIR is not set");
}
if (!NEXT_PUBLIC_URL) {
    throw new Error("NEXT_PUBLIC_URL is not set");
}

// create overviews dir
const overviewDir = path.join(os.homedir(), PROJECT_ROOT_DIR, "overview")
await fs.mkdir(overviewDir, { recursive: true })
console.log(`overview dir created at ${overviewDir}`)

// create deployed dir
const deployedDir = path.join(os.homedir(), PROJECT_ROOT_DIR, "deployed")
await fs.mkdir(deployedDir, { recursive: true })
console.log(`deployed dir created at ${deployedDir}`)

// create nginx dir
const nginxDir = path.join(os.homedir(), PROJECT_ROOT_DIR, "nginx")
await fs.mkdir(nginxDir, { recursive: true })
console.log(`nginx dir created at ${nginxDir}`)

export {}