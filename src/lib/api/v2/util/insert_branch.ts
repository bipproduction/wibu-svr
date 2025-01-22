import prisma from "@/lib/prisma";

async function insertBranch({ projectId, url }: { projectId: string, url: string }) {

    if (!url || !projectId) {
        console.log("[inserting branch]", "[url or projectId not found]", projectId, url)
        throw new Error("Url or projectId not found")
    }

    const cleanUrl = url.startsWith('@') ? url.substring(1) : url;

    // Regex untuk mengekstrak owner dan repo dari berbagai format URL
    const regex = /(?:https?:\/\/github\.com\/|git@github\.com:|^)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = cleanUrl.match(regex);

    if (!match) {
        console.log("[inserting branch]", "[url not valid]", projectId, url)
        throw new Error(`URL repository tidak valid: ${cleanUrl}`);
    }

    const owner = match[1];
    const repository = match[2].replace('.git', '');

    let page = 1;
    let hasMoreData = true;
    const allBranches: { name: string, commit: { sha: string } }[] = [];

    console.log("[inserting branch]", "[fetching all branches]", projectId, url);
    
    while (hasMoreData) {
        const apiUrl = `https://api.github.com/repos/${owner}/${repository}/branches?per_page=100&page=${page}`;
        
        const response = await fetch(apiUrl, {
            headers: { Accept: "application/vnd.github.v3+json" },
        });

        if (!response.ok) {
            console.log("[inserting branch]", "[fetching branches failed]", projectId, url);
            throw new Error(`Failed to fetch branches: ${response.status} ${response.statusText}`);
        }

        const data: { name: string, commit: { sha: string } }[] = await response.json();
        
        if (data.length === 0) {
            hasMoreData = false;
        } else {
            allBranches.push(...data);
            page++;
        }
    }

    console.log("[inserting branch]", `[inserting ${allBranches.length} branches]`, projectId, url);
    for (const branch of allBranches) {
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
        });
    }
    console.log(`inserting ${allBranches.length} branches success`);
}

export default insertBranch