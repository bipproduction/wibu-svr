import prisma from "@/lib/prisma"

async function projectRemove(id: string) {
    const res = await prisma.project.delete({
        where: {
            id
        }
    })
    return {
        status: 200,
        data: res
    }
}

export default projectRemove