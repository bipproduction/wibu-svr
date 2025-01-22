import Elysia from "elysia";
import domainsConfFindMany from "./domains-conf-find-many";
import portFindAvailable from "./port-find-available";

const Utils = new Elysia({
    prefix: "/utils",
    tags: ["Utils"],
})
    .get("/port-find-available/:count", async ({ params, set }) => {
        const res = await portFindAvailable({ count: Number(params.count) })
        set.status = res.status
        return res.data
    })
    .get("/domains-conf-find-many", async ({ set }) => {
        const res = await domainsConfFindMany()
        set.status = res.status
        return res.data
    })

export default Utils