import prisma from "@/lib/prisma"

async function projectPortFindMany({ projectId, envGroupId }: { projectId: string, envGroupId: string }) {
    const projectPort = await prisma.projectPort.findMany({
        where: {
            projectId: projectId,
            envGroupId: envGroupId
        }
    })

    return {
        data: projectPort
    }
}

export default projectPortFindMany