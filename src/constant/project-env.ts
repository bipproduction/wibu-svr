import path from "path";
import os from "os";

if (!process.env.PROJECT_ROOT_DIR) {
  throw new Error("PROJECT_ROOT_DIR is not set");
}

const PROJECT_ROOT_DIR = path.join(os.homedir(), process.env.PROJECT_ROOT_DIR);

const projectEnv = {
  PROJECT_ROOT_DIR,
};

export type ProjectEnv = typeof projectEnv;
export default projectEnv;
