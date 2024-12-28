import fs from "fs/promises";

async function hasDeployment(dir: string) {
    try {
        await fs.access(dir)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default hasDeployment    