import { ProjectEnv } from "@/constant/project-env";
import listOverview from "../utils/list-overview";

async function getOverviews(projectEnv: ProjectEnv) {
    const files = await listOverview(projectEnv)
    return files
}

export default getOverviews     