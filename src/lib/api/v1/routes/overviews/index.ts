/* eslint-disable @typescript-eslint/no-explicit-any */
import { Elysia, t } from "elysia";
import overviewCreate from "@/lib/api/v1/routes/overviews/lib/overview-create";
import overviewDelete from "@/lib/api/v1/routes/overviews/lib/overview-delete";
import overviewFind from "@/lib/api/v1/routes/overviews/lib/overview-find";
import overviewFindMany from "@/lib/api/v1/routes/overviews/lib/overview-find-many";

const overviews = new Elysia({ prefix: "/api/v1/overviews" })
    .get("/find-many", () => overviewFindMany(), {
        detail: {
            tags: ["Overviews"],
            description: "Get all overviews",
            summary: "Get all overviews",
        },
    })
    .get("/find/:appName", ({ params }) => overviewFind({ appName: params.appName }), {
        params: t.Object({
            appName: t.String(),
        }),
        detail: {
            tags: ["Overviews"],
            description: "Get overview by name",
            summary: "Get overview by name",
        },
    })
    .post("/create", async ({ body }) => {
        try {
            const { data } = await overviewCreate({ data: body as Record<string, any> })
            return {
                status: 200,
                success: true,
                message: "Success creating overview",
                data: data,
            }
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: "Failed to create overview",
                error: error,
            }
        }
    }, {
        detail: {
            tags: ["Overviews"],
            description: "Create a new overview",
            summary: "Create a new overview",
        },
        response: {
            200: t.Object({
                status: t.Number(),
                success: t.Boolean(),
                message: t.String(),
            }),
            500: t.Object({
                status: t.Number(),
                success: t.Boolean(),
                message: t.String(),
                error: t.Any(),
            }),
        },
    })
    .delete("/remove/:appName", ({ params }) => overviewDelete({ appName: params.appName }), {
        params: t.Object({
            appName: t.String(),
        }),
        detail: {
            tags: ["Overviews"],
            description: "Delete an overview",
            summary: "Delete an overview",
        },
    });

export default overviews;
