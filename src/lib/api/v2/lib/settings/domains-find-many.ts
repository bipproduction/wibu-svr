import prisma from "@/lib/prisma";

const domainsFindMany = async () => {
    const domains = await prisma.domain.findMany({
        include: {
            ServerConfig: true
        }
    })

    if (!domains) return {
        status: 404,
        message: "Domain not found"
    }

    return {
        status: 200,
        data: domains
    }
}

export default domainsFindMany;
