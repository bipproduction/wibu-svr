import cors, { HTTPMethod } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import Projects from "./lib/projects";
import EnvGroup from "./lib/env-group";
const corsConfig = {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] as HTTPMethod[],
    allowedHeaders: "*",
    exposedHeaders: "*",
    maxAge: 5,
    credentials: true,
};

const ApiV2 = new Elysia()
    .use(swagger({ path: "/api/v2/swagger" }))
    .use(cors(corsConfig))
    .group('/api/v2', (app) => app
        .use(Projects)
        .use(EnvGroup)
    );

export default ApiV2
export type APIV2 = typeof ApiV2