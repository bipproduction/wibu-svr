import {spawn} from "child_process"

async function buildDeployment(dir: string) {
    try {
        const child = spawn("bash", ["-c", "source ~/.nvm/nvm.sh &&/root/.bun/bin/bun run build"], { cwd: dir, env: { NODE_ENV: "production" } });
        child.stdout.on("data", (data) => {
            console.log(data.toString());
        });
        child.stderr.on("data", (data) => {
            console.error(data.toString());
        });
        child.on("close", (code) => {
            console.log(`Child process exited with code ${code}`);
        });
        return {
            success: true,
            message: "Deployment built successfully",
            data: child
        }
    } catch (error) {
        return {
            success: false,
            message: "Error building deployment",
            data: error
        }
    }
}

export default buildDeployment