import prisma from "@/lib/prisma";

async function projectEnvUpdate({body}: {body: {id: string, envText: string}}) {
    const {id, envText} = body;
    const project = await prisma.envItem.update({
        where: {
            id: id
        },
        data: {
            text: envText
        }
    })
    return project;
}

export default projectEnvUpdate;
