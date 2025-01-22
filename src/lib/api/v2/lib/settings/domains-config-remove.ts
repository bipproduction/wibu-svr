import prisma from "@/lib/prisma"

async function domainsConfigRemove({ id }: { id: string }) {
    try {
        const remove = await prisma.serverConfig.delete({
            where: { id }
        })

        return {
            status: 200,
            message: "Server config remove",
            data: remove
        }
    } catch (error) {
        return {
            status: 500,
            message: "Server config remove",
            data: error
        }
    }
}

export default domainsConfigRemove;