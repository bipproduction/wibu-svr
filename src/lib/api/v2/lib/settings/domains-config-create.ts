import prisma from "@/lib/prisma";

async function domainsConfigCreate({ body }: { body: { domainId: string, subDomain: string, ports: number[] } }) {

    try {
        const create = await prisma.serverConfig.create({
            data: {
                id: body.subDomain,
                name: body.subDomain,
                domainId: body.domainId,
                ports: body.ports
            }
        })

        return {
            status: 200,
            message: "Server config created",
            data: create
        }
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: "Server config created",
            data: error
        }
    }
}

export default domainsConfigCreate;