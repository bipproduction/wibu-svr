/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";

async function projectCommitSyncByBranch({ projectId, branchId }: { projectId: string, branchId: string }) {
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

        const branch = await prisma.branch.findUnique({
            where: {
                id: branchId
            }
        })
        if (!branch) {
            return {
                status: 404,
                message: "Branch not found",
            }
        }

        await insertCommit({ url: project.repository, branch: branch.name, projectId: projectId })
        return {
            status: 200,
            message: "Success",
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: "Failed",
        }
    }
}

export default projectCommitSyncByBranch;

async function insertCommit({ url, branch, projectId }: { url: string, branch: string, projectId: string }) {
    const branchData = await prisma.branch.findUnique({
        where: {
            name: branch,
            projectId_name: {
                projectId: projectId,
                name: branch
            }
        }
    })
    if (!branchData) {
        throw new Error(`Branch ${branch} not found`)
    }
    // Hapus @ dari awal URL jika ada
    const cleanUrl = url.startsWith('@') ? url.substring(1) : url;

    // Regex untuk mengekstrak owner dan repo dari berbagai format URL
    const regex = /(?:https?:\/\/github\.com\/|git@github\.com:|^)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = cleanUrl.match(regex);

    if (!match) {
        throw new Error(`URL repository tidak valid: ${cleanUrl}`);
    }

    const owner = match[1];
    const repository = match[2].replace('.git', '');

    // Gunakan branch yang diberikan dalam URL API
    const apiUrl = `https://api.github.com/repos/${owner}/${repository}/commits?sha=${branch}`;

    console.log("Mengakses URL API:", apiUrl);
    console.log("Repository:", `${owner}/${repository}`);
    console.log("Branch:", branch);

    const response = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GithubApp'
        }
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Response body:", errorBody);
        console.error("URL yang diakses:", apiUrl);
        throw new Error(`Gagal mengambil commits: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const commits: any[] = data.map((commit: any) => ({
        sha: commit.sha,
        author: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
        message: commit.commit.message,
        url: commit.html_url,
        branch: branch
    }));

    for (const commit of commits) {
        await prisma.commit.upsert({
            where: { id: commit.sha },
            update: {},
            create: {
                id: commit.sha,
                projectId,
                sha: commit.sha,
                author: commit.author,
                email: commit.email,
                date: commit.date,
                message: commit.message,
                url: commit.url,
                branchId: branchData.id
            }
        })
    }

}