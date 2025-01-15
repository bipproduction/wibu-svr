import prisma from "@/lib/prisma";

async function projectFindMany() {

    const projects = await prisma.project.findMany({
        include: {
            ProjectCommit: {
                where: {
                    envGroupId: 'production',
                },
                select: {
                    commit: true
                }
            }
        }
    })
    return {
        status: 200,
        message: 'Project created and deployed successfully',
        data: projects
    }
}

export default projectFindMany;