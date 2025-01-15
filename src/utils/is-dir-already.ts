import fs from "fs/promises";

async function isDirAlready({ dir }: { dir: string }) {
    try {
        await fs.access(dir)
        return true
    } catch (error) {
        return false
    }
}

export default isDirAlready