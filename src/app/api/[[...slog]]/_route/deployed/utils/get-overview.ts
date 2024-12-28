import { Overview } from "@/types/Deployment"
import fs from "fs/promises"

async function getOverview(filePath: string) {
    try {
        const file = await fs.readFile(filePath, "utf-8")
        const jsonFile: Overview = JSON.parse(file)
        console.log(jsonFile)
        return jsonFile
    } catch (error) {
        console.error(error)
        return null
    }
}

export default getOverview