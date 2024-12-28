import path from "path"
import fs from "fs/promises"
import { ProjectEnv } from "@/constant/project-env"

async function listOverview(projectEnv: ProjectEnv) {
    const files = await fs.readdir(path.join(projectEnv.PROJECT_ROOT_DIR, "overviews"))
    return files.map(file => file.replace(".json", ""))
}

export default listOverview 