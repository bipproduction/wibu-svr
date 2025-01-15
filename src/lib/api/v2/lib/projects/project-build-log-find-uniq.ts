import prisma from "@/lib/prisma"
import DeployLog from "../DeployLog"
import { BuildLogStatus } from "@prisma/client"

async function projectBuildLogFindUniq({ projectId, commitId }: { projectId: string, commitId: string }) {
    const runningJson = DeployLog.getLog(commitId)
    if (runningJson) {
        return {
            status: BuildLogStatus.RUNNING,
            stringLog: runningJson.join("\n"),
            jsonLog: runningJson
        }
    }


    const buildLog = await prisma.buildLog.findUnique({
        where: {
            projectId_commitId: {
                projectId,
                commitId
            }
        }
    })

    if (!buildLog) {
        return {
            status: BuildLogStatus.FAILED,
            stringLog: "",
            jsonLog: []
        }
    }

    return buildLog
}

export default projectBuildLogFindUniq