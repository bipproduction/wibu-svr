import fs from "fs/promises";

async function getReleases(dir: string) {
    try {
        const files = await fs.readdir(dir)
        return files
    } catch (error) {
        console.error(error)
        return []
    }
}

export default getReleases