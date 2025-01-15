import prisma from "@/lib/prisma";

async function projectBranchSyncAll({ projectId }: { projectId: string }) {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            },
            select: {
                repository: true
            }
        })
        if (!project) {
            return {
                status: 404,
                message: "Project not found",
            }
        }
        await syncBranchAll({ projectId, url: project.repository })
        return {
            status: 200,
            message: "Branch synced successfully",

        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "Failed to sync branch",
        }
    }
}



async function syncBranchAll({ projectId, url }: { projectId: string, url: string }) {
    const cleanUrl = url.startsWith('@') ? url.substring(1) : url;

    // Regex untuk mengekstrak owner dan repo dari berbagai format URL
    const regex = /(?:https?:\/\/github\.com\/|git@github\.com:|^)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = cleanUrl.match(regex);

    if (!match) {
        throw new Error(`URL repository tidak valid: ${cleanUrl}`);
    }

    const owner = match[1];
    const repository = match[2].replace('.git', '');
    const apiUrl = `https://api.github.com/repos/${owner}/${repository}/branches`;

    console.log("fetching branches")
    const response = await fetch(apiUrl, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.status} ${response.statusText}`);
    }

    const data: { name: string, commit: { sha: string } }[] = await response.json();
    console.log("inserting branches")
    for (const branch of data) {
        await prisma.branch.upsert({
            where: {
                projectId_name: {
                    projectId: projectId,
                    name: branch.name
                }
            },
            update: {
                sha: branch.commit.sha
            },
            create: {
                name: branch.name,
                projectId: projectId,
                sha: branch.commit.sha
            }
        })
    }
    console.log("inserting branches success")
}

export default projectBranchSyncAll