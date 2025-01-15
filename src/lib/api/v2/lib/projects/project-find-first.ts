import prisma from "@/lib/prisma"

async function projectFindFirst() {
    const res = await prisma.project.findFirst()
    return {
        status: 200,
        data: res
    }
}

export default projectFindFirst