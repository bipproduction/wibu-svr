import { Elysia } from "elysia";
import { exec } from "child_process";
import { promisify } from "util";
import { PM2Jlist } from "@/constant/pm2-jlist";

const execAsync = promisify(exec);

const apiProcess = new Elysia({ prefix: "/api/process" })
    .get(
        "/",
        async () => {
            try {
                const result = await execAsync("pm2 jlist");
                const jsonData: PM2Jlist[] = JSON.parse(result.stdout);
                const listData = jsonData.map((item) => {
                    return {
                        name: item.name,
                        pid: item.pid,
                        status: item.pm2_env.status,
                        cwd: item.pm2_env.cwd,
                        created_at: item.pm2_env.created_at,
                        restart_time: item.pm2_env.restart_time
                    };  
                });
                const listStopped = listData.filter((item) => item.status === "stopped");
                const listOnline = listData.filter((item) => item.status === "online");
                return {
                    data: {
                        online: listOnline,
                        stopped: listStopped
                    },
                };
            } catch (error) {
                console.error(error);
                return {
                    data: [],
                    error: error,
                };
            }
        },
        {
            tags: ["process"],
            detail: { summary: "Get list of process", description: "Get list of process online and stopped" }
        }
    );

export default apiProcess;
