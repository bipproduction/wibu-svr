import path from "path";
import fs from "fs/promises";
import projectEnv from "@/utils/project-env";
import { parseNginxToSubdomainJson } from "@/utils/nginx";
import prisma from "@/lib/prisma";
import _ from "lodash";

async function domainsCheckNeedSync() {
    const configsLocal = (await fs.readdir(projectEnv.NGINX_CONF_DIR)).filter((file) => file.endsWith(".conf"));
    const listConfigLocal = [];
    for (const config of configsLocal) {
        const configBackup = path.join(projectEnv.NGINX_CONF_DIR, config);
        const file = await fs.readFile(configBackup, "utf-8");
        listConfigLocal.push({
            name: config.split(".")[0],
            ServerConfig: parseNginxToSubdomainJson(file).subdomains,
        });
    }


    const listConfigRemote = await prisma.domain.findMany({
        select: {
            name: true,
            ServerConfig: {
                select: {
                    id: true,
                    ports: true,
                    domainId: true,
                    name: true,
                }
            }
        }
    });

    // const isDiff = !_.isEqual(listConfigLocal, configsRemote);
    const diff = _.differenceWith(listConfigLocal, listConfigRemote, _.isEqual);

    return {
        status: 200,
        message: "Config check need sync",
        data: {
            listConfigLocal,
            listConfigRemote,
            diff,
        },
    };
}

export default domainsCheckNeedSync;