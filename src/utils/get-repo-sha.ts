import { exec } from "child_process";
import { promisify } from 'util';
const execPromise = promisify(exec)

async function getRepoSha({ repo, branch }: { repo: string, branch: string }) {
   try {
        const res = await execPromise(`git ls-remote ${repo} ${branch}`)
        const sha = res.stdout.split('\t')[0];
        return sha
    } catch (error) {
        console.log(error)
        return null
   }
}

export default getRepoSha