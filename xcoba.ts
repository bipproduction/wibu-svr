import prisma from "@/lib/prisma";

const projectId = "0e533d6d-b0de-401a-a222-45f119fb08f3"
const branchName = "main"

const projectData = await prisma.project.findUnique({
    where: {
        id: projectId
    },
    select: {
        name: true,
        repository: true,
        Branch: {
            select: {
                name: true
            }
        }
    }
})

console.log(projectData)
if (!projectData) {
    console.log("[xcoba]", "[project not found]", projectId)
    throw new Error("Project not found")
}

const branchData = await prisma.branch.findUnique({
    where: {
        projectId_name: {
            projectId: projectId,
            name: branchName
        }
    }
})

console.log(branchData)