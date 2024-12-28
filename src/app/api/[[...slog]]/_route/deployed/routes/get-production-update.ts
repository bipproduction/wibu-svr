import path from "path"
import { ProjectEnv } from "@/constant/project-env"
import getOverview from "../utils/get-overview"
import getReleases from "../utils/get-releases"
import getSha from "../utils/get-sha"

async function getProductionUpdate({ projectEnv, name }: { projectEnv: ProjectEnv, name: string }) {
    try {
        const releasesDir = path.join(projectEnv.PROJECT_ROOT_DIR, "deployments", name, "deployed", "production", "releases")
        const overviewPath = path.join(projectEnv.PROJECT_ROOT_DIR, "overviews", name + ".json")
        const overview = await getOverview(overviewPath)
        const releases = await getReleases(releasesDir)

        if (!overview) {
            return {
                success: false,
                message: "Overview not found"
            }
        }
        const sha = await getSha({ repo: overview.project.repository, branch: overview.project.deployments.production.branch })
        if (!sha) {
            return {
                success: false,
                message: "Error fetching SHA"
            }
        }

        const hasRelease = releases.find(release => release.split("-")[1] === sha)

        return {
            success: true,
            message: "Production update fetched successfully",
            data: {
                hasRelease: hasRelease ? true : false,
                sha,
                releases
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Error fetching production update"
        }
    }
}

export default getProductionUpdate      