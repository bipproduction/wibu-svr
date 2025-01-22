import prisma from "@/lib/prisma"

async function projectDomainsFindUniq(params: { projectId: string, envGroupId: string, serverConfigId: string }) {
    try {
        const projectSubDomain = await prisma.projectSubDomain.findUnique({
            where: {
                projectId_envGroupId_serverConfigId: {
                    projectId: params.projectId,
                    envGroupId: params.envGroupId,
                    serverConfigId: params.serverConfigId
                }
            }
        })

        if (!projectSubDomain) {
            return {
                status: 204,
                message: "No project domain found"
            }
        }

        return {
            status: 200,
            data: projectSubDomain
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "Internal server error"
        }
    }
}

export default projectDomainsFindUniq