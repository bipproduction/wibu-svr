async function getLatestCommitSha({ url, branch }: { url: string, branch: string }) {
    const cleanUrl = url.startsWith('@') ? url.substring(1) : url;

    // Regex untuk mengekstrak owner dan repo dari berbagai format URL
    const regex = /(?:https?:\/\/github\.com\/|git@github\.com:|^)([^\/]+)\/([^\/\.]+)(?:\.git)?/;
    const match = cleanUrl.match(regex);

    if (!match) {
        throw new Error(`URL repository tidak valid: ${cleanUrl}`);
    }

    const owner = match[1];
    const repository = match[2].replace('.git', '');
    const apiUrl = `https://api.github.com/repos/${owner}/${repository}/branches/${branch}`;

    console.log(`fetching commit SHA for branch: ${branch}`)
    const response = await fetch(apiUrl, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch branch data: ${response.status} ${response.statusText}`);
    }

    const data: { name: string, commit: { sha: string } } = await response.json();
    return data.commit.sha;
}

export default getLatestCommitSha