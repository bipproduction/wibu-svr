/* eslint-disable @typescript-eslint/no-unused-vars */
import getRepoSha from "@/utils/get-repo-sha";
import overviewFind from "../../overviews/lib/overview-find";
import deploymentReleaseFindMany from "./release/deployment-release-find-many";


async function findRepoSync({ appName, level }: { appName: string, level: string }) {
    try {
        const { data } = await overviewFind({ appName })
        if (!data) {
            return {
                status: 404,
                success: false,
                message: "overview not found",
            }
        }
        const projectLevel = data.project.levels[level as keyof typeof data.project.levels]
        if (!projectLevel) {
            return {
                status: 404,
                success: false,
                message: "project level not found",
            }
        }

        const sha = await getRepoSha({ repo: data.project.repository, branch: projectLevel.branch })
        if (!sha) {
            return {
                status: 404,
                success: false,
                message: "sha not found",
            }
        }

        const getReleases = await deploymentReleaseFindMany({ appName, level })

        const releases = getReleases.data??[]

        const release = releases?.find((release) => release.release.includes(sha))

        return {
            status: 200,
            success: true,
            data: {
                needSync: !release,
                repoSha: sha,
                releases: getReleases.data
            },
        }
    } catch (error) {
        // console.log(error)
        return {
            status: 500,
            success: false,
            message: "error find repo sync",
        }
    }

}   

export default findRepoSync