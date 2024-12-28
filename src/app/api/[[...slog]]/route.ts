import cors, { HTTPMethod } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import overview from "./_route/overview";
import projectEnv from "@/constant/project-env";
import deployed from "./_route/deployed";
import nginx from "./_route/nginx";
import apiProcess from "./_route/process";

const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] as HTTPMethod[],
  allowedHeaders: "*",
  exposedHeaders: "*",
  maxAge: 5,
  credentials: true,
};

const app = new Elysia()
  .decorate({ projectEnv })
  .use(swagger({ path: "/api/swagger" }))
  .use(cors(corsConfig))
  .use(overview)
  .use(deployed)
  .use(nginx)
  .use(apiProcess);


// Expose methods
export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const PUT = app.handle;

export type API = typeof app;
