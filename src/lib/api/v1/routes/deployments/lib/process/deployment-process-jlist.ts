import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

async function deploymentProcessJlist() {
    try {
        const result = await execAsync(`pm2 jlist`)
        const resultJson = JSON.parse(result.stdout.toString().trim())
        return {
            status: 200,
            message: "process list",
            result: resultJson
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "process list failed",
            error: error
        }
    }
}

export default deploymentProcessJlist   