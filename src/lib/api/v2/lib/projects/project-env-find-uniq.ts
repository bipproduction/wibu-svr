import prisma from "@/lib/prisma";

async function projectEnvFindUniq({ projectId }: { projectId: string }) {
    const envGroup = await prisma.envGroup.findMany({
        include: {
            envItem: {
                where: {
                    projectId: projectId
                }
            }
        }
    })

    return {
        status: 200,
        data: envGroup
    }
}

export default projectEnvFindUniq
