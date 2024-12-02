import { Elysia } from "elysia";
import { sortServer } from "./lib/sort-server";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));
const port = argv.port || argv.p || 3000;

const app = new Elysia().get("/", () => "Hello Elysia").listen(port);
app.get("/sort-server", sortServer);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
