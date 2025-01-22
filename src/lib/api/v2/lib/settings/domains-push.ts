import prisma from "@/lib/prisma";
import { generateNginxFromSubdomain, SubdomainConfig } from "@/utils/nginx";
import projectEnv from "@/utils/project-env";
import fs from "fs/promises";
import path from "path";
import serverBackupConfig from "../../util/server-backup-config";

async function pushDomains({ domainId }: { domainId: string }) {
    const res = await serverBackupConfig({ name: domainId })
    if (res.status !== 200) {
        return res;
    }
    try {
        const domain = await prisma.domain.findUnique({
            where: {
                id: domainId,
            },
            include: {
                ServerConfig: {
                    select: {
                        id: true,
                        domainId: true,
                        name: true,
                        ports: true,
                    }
                },
            },
        });
        if (!domain) {
            return {
                status: 404,
                message: "Domain not found",
            }
        }

        const subdomainConfig: SubdomainConfig = {
            subdomains: domain.ServerConfig.map(v => ({
                id: v.id,
                domainId: v.domainId,
                name: v.name,
                ports: v.ports,
            })),
        }

        const domainConfig = generateNginxFromSubdomain(subdomainConfig)
        const confDir = projectEnv.NGINX_CONF_DIR
        await fs.writeFile(path.join(confDir, `${domain.id}.conf`), domainConfig)
        return {
            status: 200,
            message: "Domains pushed successfully",
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: "Failed to push domains",
        }
    }
}

export default pushDomains;
