import cors, { HTTPMethod } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import deployments from "@/lib/api/v1/routes/deployments";
import tools from "@/lib/api/v1/routes/tools";
import overviews from "@/lib/api/v1/routes/overviews";
const corsConfig = {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] as HTTPMethod[],
    allowedHeaders: "*",
    exposedHeaders: "*",
    maxAge: 5,
    credentials: true,
};

const apiV1 = new Elysia()
    .use(swagger({
        path: "/api/v1/swagger", autoDarkMode: true, documentation: {
            info: {
                title: "Wibu Server",
                description: "Wibu Server API Documentation for the project",
                version: "1.0.0",
                contact: {
                    name: "Wibu Server",
                    url: "https://github.com/your-repo/api-docs",
                    email: "your-email@example.com"
                }
            }
        }
    }))
    .use(cors(corsConfig))
    .use(overviews)
    .use(deployments)
    .use(tools);

export default apiV1
export type ApiV1 = typeof apiV1