/* eslint-disable @typescript-eslint/no-unused-vars */

import Elysia, { t } from "elysia";
import fs from "fs/promises";
import path from "path";

const rootConfig = "/etc/nginx/conf.d"

const nginx = new Elysia({ prefix: "/api/nginx" })
    .get("/config", async () => {
        const files = await getListNginxConfig()
        return {
            data: files
        }
    }, { tags: ["nginx"], detail: { summary: "Get list of nginx config files" } })
    .get("/config/:name", async ({ params }: { params: { name: string } }) => {
        const filePath = path.join(rootConfig, params.name)
        return await getTextFile(filePath)
    }, { tags: ["nginx"], params: t.Object({ name: t.String() }), detail: { summary: "Get nginx config file by name" } })

export default nginx


async function getTextFile(filePath: string) {
    const fileExists = await checkFileExists(filePath);
    if (!fileExists) {
        return {
            success: false,
            message: "File does not exist"
        }
    }
    try {
        const file = await fs.readFile(filePath, "utf-8");
        return {
            data: file
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error reading file"
        };
    }
}


async function getListNginxConfig() {
    const files = await fs.readdir(rootConfig)
    return files;
}

async function checkFileExists(filePath: string) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}
