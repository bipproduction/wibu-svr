import prisma from "@/lib/prisma";

async function projectBranchOnlyFindMany({ projectId }: { projectId: string }) {
    const branches = await prisma.branch.findMany({
        where: {
            projectId
        },
        select: {
            id: true,
            name: true,
            projectId: true
        }
    })
    return {
        data: branches,
        status: 200
    }
}

export default projectBranchOnlyFindMany