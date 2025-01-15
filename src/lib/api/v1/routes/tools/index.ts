import { Elysia, t } from "elysia";
import envToJson from "./lib/env-to-json";
import treeView from "./lib/tree-view";

const tools = new Elysia({ prefix: "/api/v1/tools" })
    .post("/env-to-json", ({ body }) => envToJson({ envText: body.envText }), {
        body: t.Object({
            envText: t.String(),
        }),
        detail: {
            tags: ["Tools"],
            description: "Convert environment text to JSON",
            summary: "Convert environment text to JSON",
        },
    })
    .get("/tree-view", () => treeView(), {
        detail: {
            tags: ["Tools"],
            description: "Tree view",
            summary: "Tree view"
        }
    });

export default tools;
