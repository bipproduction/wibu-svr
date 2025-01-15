import prisma from "@/lib/prisma";

async function envGroupFindAll() {
    const envGroup = await prisma.envGroup.findMany()

    return {
        data: envGroup
    }
}

export default envGroupFindAll