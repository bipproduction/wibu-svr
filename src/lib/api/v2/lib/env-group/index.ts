import Elysia from "elysia";
import envGroupFindAll from "./env-group-find-all";

const EnvGroup = new Elysia({
    prefix: "/env-group",
    tags: ["EnvGroup"]
})
    .get("/find-all", () => envGroupFindAll())

export default EnvGroup
