/* eslint-disable @typescript-eslint/no-explicit-any */
interface CommitData {
  sha: string;
  author: string;
  email: string;
  date: string;
  message: string;
  url: string;
}

interface RepoCommitResponse {
  latest: CommitData;
  commits: CommitData[];
}

export async function getRepoCommitData(
  url: string,
  branch: string = 'main'
): Promise<RepoCommitResponse> {
  try {
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

    const commits = data.map((commit: any) => ({
      sha: commit.sha,
      author: commit.commit.author.name,
      email: commit.commit.author.email,
      date: commit.commit.author.date,
      message: commit.commit.message,
      url: commit.html_url,
      branch: branch
    }));

    return {
      latest: commits[0], // Commit terbaru adalah index pertama
      commits: commits    // Semua commits
    };

  } catch (error) {
    console.error('Error lengkap:', error);
    return {
      latest: {} as CommitData,
      commits: []
    };
  }
}

export default getRepoCommitData;