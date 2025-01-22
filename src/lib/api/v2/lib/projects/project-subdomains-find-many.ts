import prisma from "@/lib/prisma";

async function projectDomainsFindMany(params: { projectId: string }) {
    try {
        const envGroup = await prisma.envGroup.findMany({
            select: {
                id: true,
                name: true,
                ProjectSubDomain: {
                    where: {
                        projectId: params.projectId
                    },
                    select: {
                        domainId: true
                    }
                }
            },
        })

        const domains = await prisma.domain.findMany({
            select: {
                id: true,
                name: true,
                ServerConfig: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })


        return {
            status: 200,
            data: {
                envGroup,
                domains
            },
            message: "Project domains found"
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "Internal server error"
        }
    }
}

export default projectDomainsFindMany