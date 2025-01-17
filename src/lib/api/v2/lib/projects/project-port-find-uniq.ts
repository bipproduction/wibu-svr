
import prisma from "@/lib/prisma";

async function projectPortFindUniq({ projectId, envGroupId }: { projectId: string, envGroupId: string }) {
    const projectPort = await prisma.projectPort.findUnique({
        where: {
            projectId_envGroupId: {
                projectId,
                envGroupId
            }
        }
    })

    return {
        data: projectPort
    }
}

export default projectPortFindUniq