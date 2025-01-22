import prisma from "@/lib/prisma";
import { parseNginxToSubdomainJson, SubdomainConfig } from "@/utils/nginx";
import projectEnv from "@/utils/project-env";
import fs from "fs/promises";
import path from "path";

async function domainsPull() {

    try {
        const confDir = projectEnv.NGINX_CONF_DIR
        const domains = (await fs.readdir(confDir)).filter(v => v.endsWith(".conf"))

        for (const i of domains) {
            const domainName = i.split(".")[0]
            const confFiles = await fs.readFile(path.join(confDir, i), 'utf-8')
            const jsonConfig: SubdomainConfig = parseNginxToSubdomainJson(confFiles)
            await prisma.domain.upsert({
                where: {
                    id: domainName
                },
                create: {
                    id: domainName,
                    name: domainName
                },
                update: {}
            })
            for (const j of jsonConfig.subdomains) {
                await prisma.serverConfig.upsert({
                    where: {
                        id: j.id
                    },
                    create: {
                        id: j.id,
                        name: j.name,
                        ports: j.ports,
                        domainId: domainName
                    },
                    update: {}
                })
            }
        }


        return {
            status: 200,
            data: "Success",
            message: "Domains pulled successfully",
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            data: error,
            message: "Failed to pull domains",
        }
    }
}

export default domainsPull;