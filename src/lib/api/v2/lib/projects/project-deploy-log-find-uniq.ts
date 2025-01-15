import { BuildLogStatus } from "@prisma/client"
import DeployLog from "../DeployLog"
import prisma from "@/lib/prisma"

async function projectDeployLogFindUniq({ projectId, commitId }: { projectId: string, commitId: string }) {
    const runningJson = DeployLog.getLog(commitId)
    if (runningJson.length > 0) {
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

export default projectDeployLogFindUniq