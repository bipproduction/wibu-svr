/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ProjectEnv } from "@/constant/project-env";
import Elysia, { t } from "elysia";
import fs from "fs/promises";
import path from "path";


const overview = new Elysia({ prefix: "/api/overviews" })
  .get(
    "/",
    async ({ projectEnv }: { projectEnv: { PROJECT_ROOT_DIR: string } }) => {
      const files = await fs.readdir(
        path.join(projectEnv.PROJECT_ROOT_DIR, "overview")
      );
      return {
        data: files,
      };
    },
    { tags: ["overviews"] }
  )
  .get(
    "/:name",
    async ({ projectEnv, params }: { projectEnv: ProjectEnv, params: { name: string } }) => {
      const file = await fs.readFile(
        path.join(projectEnv.PROJECT_ROOT_DIR, "overview", params.name),
        "utf-8"
      );
      return {
        data: file,
      };
    },
    { tags: ["overviews"], params: t.Object({ name: t.String() }) }
  )
  .put(
    "/:name",
    async ({ projectEnv, params, body }: { projectEnv: ProjectEnv, params: { name: string }, body: Record<string, any> }) => {
      console.log(body)
      const filePath = path.join(projectEnv.PROJECT_ROOT_DIR, "overview", params.name + ".json");
      const fileExists = await checkFileExists(filePath);
      if (fileExists) {
        return {
          success: false,
          message: "File already exists",
        };
      }

      try {
        await fs.writeFile(
          path.join(
            projectEnv.PROJECT_ROOT_DIR,
            "overview",
            params.name + ".json"
          ),
          JSON.stringify(body, null, 2),
          "utf-8"
        );
        return {
          success: true,
          message: "File created successfully",
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Error creating file",
        };
      }

    },
    {
      tags: ["overviews"],
      params: t.Object({ name: t.String() }),
    }
  )
  .delete("/:name", async ({ projectEnv, params }: { projectEnv: ProjectEnv, params: { name: string } }) => {
    try {
      await fs.rm(
        path.join(projectEnv.PROJECT_ROOT_DIR, "overview", params.name),
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
  }, { tags: ["overviews"], params: t.Object({ name: t.String() }) });

async function checkFileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export default overview;
