import path from "path"
import fs from "fs/promises"
import projectEnv from "@/utils/project-env"

async function projectConfigTextFindUniq({ projectId, envGroupId }: { projectId: string, envGroupId: string }) {
    const configPath = path.join(projectEnv.PROJECTS_DIR, projectId, "configs")

    const configFiles = await fs.readdir(configPath)
    const config = configFiles.map(file => file.split(".")[0])
    const finalResult = config.find(item => item.includes(envGroupId))
    if (!finalResult) {
        return {
            status: 404,
            data: {},
            message: "No config found"
        }
    }

    const configContent = await fs.readFile(path.join(configPath, finalResult + ".json"), "utf-8")

    const data: Record<string, string> | null = JSON.parse(configContent)
    if (!data) {
        return {
            status: 404,
            data: {},
            message: "No config found"
        }
    }
    return {
        status: 200,
        data: data,
        message: "Config found"
    }
}

export default projectConfigTextFindUniq
