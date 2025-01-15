import prisma from "@/lib/prisma"

async function projectFindUnique({ id }: { id: string }) {
    console.log(id)
    try {
        const res = await prisma.project.findUnique({
            where: {
                id
            }
        })
        return {
            status: 200,
            data: res
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Failed to load project data"
        }
    }
}

export default projectFindUnique