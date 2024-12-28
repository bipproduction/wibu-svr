import fs from "fs/promises";

async function checkFileExists(filePath: string) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default checkFileExists;