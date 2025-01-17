import findPort from "@/utils/find-port";
import Elysia, { t } from "elysia";

const Utils = new Elysia({
    prefix: "/utils",
    tags: ["Utils"],
})
    .get("/find-port", async ({ query }) => {
        const { count } = query
        const ports = await findPort({ count })
        return ports
    }, {
        query: t.Object({
            count: t.Number()
        })
    })

export default Utils