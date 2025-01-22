import prisma from "@/lib/prisma";

async function domainsConfigUpdate({ body }: { body: { id: string, name: string, ports: number[] } }) {
    try {
        const update = await prisma.serverConfig.update({
            where: {
                id: body.id
            },
            data: {
                name: body.name,
                ports: body.ports
            }
        })
        return {
            status: 200,
            message: "Config updated successfully",
            data: update
        }
    } catch (error) {
        return {
            status: 500,
            message: "Error updating config",
            data: error
        }
    }
}

export default domainsConfigUpdate;