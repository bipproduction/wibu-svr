/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma"

async function projectUpdate(id: string, data: any) {
    const res = await prisma.project.update({
        where: { id },
        data
    })
    return {
        status: 200,
        data: res
    }
}

export default projectUpdate