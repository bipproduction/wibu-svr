/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ProjectEnv } from "@/constant/project-env";
import Elysia, { t } from "elysia";
import fs from "fs/promises";
import path from "path";
import getOverviews from "./routes/get-overviews";
import postOverview from "./routes/post-overview";

const overviewsDir = "overviews"

const overview = new Elysia({ prefix: "/api/overviews" })
  .get(
    "/",
    async ({ projectEnv }: { projectEnv: ProjectEnv }) => {
      const files = await getOverviews(projectEnv)
      return {
        data: files,
      };
    },
    { tags: ["overviews"], detail: { summary: "Get list of overviews", description: "Get list of overviews on remote repository" } }
  )
  .get(
    "/:name",
    async ({ projectEnv, params }: { projectEnv: ProjectEnv, params: { name: string } }) => {
      try {
        const file = await fs.readFile(
          path.join(projectEnv.PROJECT_ROOT_DIR, overviewsDir, params.name + ".json"),
          "utf-8"
        );
        const jsonData = JSON.parse(file);
        return {
          data: jsonData,
        };
      } catch (error) {
        console.error(error);
        return {
          data: null,
        };
      }
    },
    { tags: ["overviews"], params: t.Object({ name: t.String() }), detail: { summary: "Get overview by name", description: "Get overview by name on remote repository" } }
  )
  .post(
    "/create",
    postOverview,
    {
      tags: ["overviews"],
      body: t.Object({
        data: t.Object({})
      }),
      detail: { summary: "Create overview", description: "Create overview on remote repository" }
    }
  )
  .delete("/:name", async ({ projectEnv, params }: { projectEnv: ProjectEnv, params: { name: string } }) => {
    try {
      await fs.rm(
        path.join(projectEnv.PROJECT_ROOT_DIR, overviewsDir, params.name),
        { recursive: true }
      );
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
      };

    }
  }, { tags: ["overviews"], params: t.Object({ name: t.String() }), detail: { summary: "Delete overview by name", description: "Delete overview by name on remote repository" } });



export default overview;
