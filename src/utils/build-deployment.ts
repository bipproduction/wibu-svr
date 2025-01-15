import { spawn } from "child_process";

async function buildDeployment({ dir }: { dir: string }) {
    const child = spawn("bash", ["-c", "source ~/.nvm/nvm.sh && nice -n 19 /root/.bun/bin/bun run build"], { cwd: dir, env: { NODE_ENV: "production" } });
    child.stdout.on("data", (data) => {
        console.log(data.toString());
    });
    child.stderr.on("data", (data) => {
        console.error(data.toString());
    });
    child.on("close", (code) => {
        console.log(`Child process exited with code ${code}`);
    });
}   

export default buildDeployment