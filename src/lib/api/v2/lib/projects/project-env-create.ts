import prisma from "@/lib/prisma";

async function projectEnvCreate({body}: {body: {projectId: string, envGroup: string, envText: string}}) {
    const {projectId, envGroup, envText} = body;
    const project = await prisma.envItem.create({
        data: {
            projectId: projectId,
            envGroupId: envGroup,
            text: envText
        }
    })
    return project;
}

export default projectEnvCreate;