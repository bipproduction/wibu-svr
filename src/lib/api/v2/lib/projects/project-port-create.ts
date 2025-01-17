import prisma from "@/lib/prisma"
import projectEnv from "@/utils/project-env"
import EnvStringParser from "../../util/EnvStringParse"
import fs from "fs/promises"

function configTemplate({ projectId, envGroupId, envJson, ports }: { projectId: string, envGroupId: string, envJson: Record<string, string>, ports: number[] }) {
    const configs = []


    for (const port of ports) {
        const config = {
            "name": `${projectId}-${envGroupId}-${port}`,
            "script": "bun",
            "args": `--bun run start`,
            "exec_mode": "fork",
            "instances": 1,
            "env": {
                "NODE_ENV": "production",
                "PORT": 3310,
                ...envJson
            },
            "error_file": `${projectEnv.PROJECTS_DIR}/${projectId}/logs/${envGroupId}-${port}/error.log`,
            "out_file": `${projectEnv.PROJECTS_DIR}/${projectId}/logs/${envGroupId}-${port}/output.log`,
            "log_date_format": "YYYY-MM-DD HH:mm:ss",
            "max_memory_restart": "1G",
            "autorestart": true,
            "watch": false,
            "wait_ready": true,
            "restart_delay": 4000,
            "merge_logs": true,
            "time": true,
            "max_size": "10M",
            "retain": 5,
            "compress": true,
            "source_map_support": false,
            "cwd": `${projectEnv.PROJECTS_DIR}/${projectId}/current`,
            "namespace": `${projectId}-${envGroupId}`
        }

        configs.push(config)
    }

    return {
        "apps": configs
    }
}


async function projectPortCreate({ projectId, envGroupId, ports }: { projectId: string, envGroupId: string, ports: number[] }) {

    const projectPort = await prisma.projectPort.upsert({
        where: {
            projectId_envGroupId: {
                projectId: projectId,
                envGroupId: envGroupId
            }
        },
        update: {
            ports: ports
        },
        create: {
            projectId: projectId,
            envGroupId: envGroupId,
            ports: ports
        }
    })


    const envItem = await prisma.envItem.findUnique({
        where: {
            projectId_envGroupId: {
                projectId: projectId,
                envGroupId: envGroupId
            }
        }
    })

    if (!envItem) {
        return {
            success: false,
            error: "Env item not found"
        }
    }

    const envJson = EnvStringParser.parse(envItem.text)

    const createConfig = configTemplate({ projectId, envGroupId, envJson, ports })

    const configPath = `${projectEnv.PROJECTS_DIR}/${projectId}/configs`
    await fs.mkdir(configPath, { recursive: true })
    await fs.writeFile(`${configPath}/${envGroupId}.json`, JSON.stringify(createConfig, null, 2), {
        encoding: "utf-8",
        flag: "w"
    })

    return {
        success: true,
        data: projectPort,
        config: createConfig
    }
}

export default projectPortCreate