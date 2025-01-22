import prisma from "@/lib/prisma";

async function projectSubdomainsCreate(params: { projectId: string, envGroupId: string, serverConfigId: string, domainId: string }) {
    try {
        const projectDomain = await prisma.projectSubDomain.upsert({
            where: {
                projectId_envGroupId_serverConfigId: {
                    projectId: params.projectId,
                    envGroupId: params.envGroupId,
                    serverConfigId: params.serverConfigId
                }
            },
            update: {
                serverConfigId: params.serverConfigId
            },
            create: {   
                projectId: params.projectId,
                envGroupId: params.envGroupId,
                serverConfigId: params.serverConfigId,
                domainId: params.domainId   
            }
        })

        return {
            status: 200,
            data: projectDomain,
            message: "Subdomain connected successfully"
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "Internal server error"
        }
    }
}

export default projectSubdomainsCreate