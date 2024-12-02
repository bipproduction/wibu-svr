import { Elysia } from "elysia";
import { sortServer } from "./lib/sort-server";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);
app.get("/sort-server", sortServer);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
