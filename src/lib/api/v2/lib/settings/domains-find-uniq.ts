import prisma from "@/lib/prisma";

async function domainsFindUniq({ domain }: { domain: string }) {
    const domains = await prisma.domain.findUnique({
        where: {
            name: domain
        },
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

export default domainsFindUniq;
