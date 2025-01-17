import prisma from "@/lib/prisma";

async function envGroupFindMany() {
    const envGroup = await prisma.envGroup.findMany()

    return {
        data: envGroup
    }
}

export default envGroupFindMany