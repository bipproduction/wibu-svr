import Elysia, { t } from "elysia";
import domainsFindMany from "./domains-find-many";
import domainsFindUniq from "./domains-find-uniq";
import domainsPull from "./domains-pull";
import domainsConfigCreate from "./domains-config-create";
import domainsConfigRemove from "./domains-config-remove";
import domainsPush from "./domains-push";
import domainsConfigUpdate from "./domains-config-update";
import domainsCheckNeedSync from "./domains-check-need-sync";
import domainsConfigLocalFindMany from "./domains-config-local-find-many";

const Settings = new Elysia({
    prefix: "/settings",
    tags: ["settings"],
})
    .get("/domains/find-many", async ({ set }) => {
        const res = await domainsFindMany();
        set.status = res.status;
        return res;
    })
    .get("/domains/find-uniq/:domain", async ({ params, set }) => {
        const res = await domainsFindUniq(params);
        set.status = res.status;
        return res;
    })
    .get("/domains/pull", async ({ set }) => {
        const res = await domainsPull();
        set.status = res.status;
        return res;
    }, {
        detail: {
            tags: ["settings/domains"],
            summary: "Pull domains from the server",
            description: "Pull domains from the server",
        }
    })
    .post("/domains/push/:domainId", async ({ params, set }) => {
        const res = await domainsPush(params);
        set.status = res.status;
        return res;
    }, {
        detail: {
            tags: ["settings/domains"],
            summary: "Push domains to the server",
            description: "Push domains to the server",
        }
    })
    .post("/domains/config-create", async ({ set, body }) => {
        const res = await domainsConfigCreate({
            body: {
                domainId: body.domain,
                subDomain: body.subDomain,
                ports: body.ports
            }
        });
        set.status = res.status;
        return res;
    }, {
        body: t.Object({
            domain: t.String(),
            subDomain: t.String(),
            ports: t.Array(t.Number())
        })
    })
    .post("/domains/config-update", async ({ set, body }) => {
        const res = await domainsConfigUpdate({ body });
        set.status = res.status;
        return res;
    }, {
        body: t.Object({
            id: t.String(),
            name: t.String(),
            ports: t.Array(t.Number())
        })
    })
    .delete("/domains/config-remove/:id", async ({ params, set }) => {
        const res = await domainsConfigRemove(params);
        set.status = res.status;
        return res;
    })
    .get("/domains/check-need-sync", async ({ set }) => {
        const res = await domainsCheckNeedSync();
        set.status = res.status;
        return res;
    }, {
        detail: {
            tags: ["settings/domains"],
            summary: "Check need sync",
            description: "Check need sync",
        }
    })
    .get("/domains/config-local-find-many", async ({ set }) => {
        const res = await domainsConfigLocalFindMany();
        set.status = res.status;
        return res;
    });

export default Settings;