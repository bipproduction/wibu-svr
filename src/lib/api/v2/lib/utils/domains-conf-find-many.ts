import prisma from "@/lib/prisma"

async function domainsConfFindMany() {
    const domains = await prisma.domain.findMany({
        include: {
            ServerConfig: true
        }
    })
    return {
        status: 200,
        data: domains
    }
}

export default domainsConfFindMany
