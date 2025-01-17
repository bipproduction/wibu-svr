import Elysia from "elysia";
import envGroupFindMany from "./env-group-find-many";

const EnvGroup = new Elysia({
    prefix: "/env-group",
    tags: ["EnvGroup"]
})
    .get("/find-many", () => envGroupFindMany())

export default EnvGroup
