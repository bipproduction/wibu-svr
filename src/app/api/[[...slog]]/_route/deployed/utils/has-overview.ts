import fs from "fs/promises";

async function hasOverview(filePath: string) {
    try {
        await fs.access(filePath)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default hasOverview