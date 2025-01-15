import { execSync, spawn } from "child_process";
import dedent from "dedent";
import path from "path";
import buildLog from "@/utils/build-log";
import releasePath from "@/utils/release-path";
import overviewFindByName from "@/lib/api/v1/routes/overviews/lib/overview-find";

const activeBuilds = new Map<string, boolean>();

async function deploymentReleaseBuild({ appName, level, release }: { appName: string, level: string, release: string }) {
    const buildKey = `${appName}-${level}-${release}`;
    
    if (activeBuilds.get(buildKey)) {
        return {
            status: 409,
            success: false,
            message: "Build sedang berjalan untuk release ini",
        }
    }

    try {
        activeBuilds.set(buildKey, true);

        const dir = path.join(releasePath({ appName, level }), release)
        const getBunx = execSync("which bunx").toString().trim()
        const getBun = execSync("which bun").toString().trim()
        const getNice = execSync("which nice").toString().trim()
        const { data } = await overviewFindByName({ appName })

        const fileName = `${release}`
        const log = await buildLog({ appName, fileName })

        if (!data) {
            return {
                status: 404,
                success: false,
                message: "overview not found",
            }
        }

        const projectEnv = data.project.levels[level as keyof typeof data.project.levels].env
        if (!projectEnv) {
            return {
                status: 400,
                success: false,
                message: "environment not found",
            }
        }

        const command = dedent`
        bun install
        bun run prisma db push
        bun run prisma/seed.ts
        nice -n 19 bun run next build
    `

        const BUILD_TIMEOUT = 30 * 60 * 1000; // 30 menit
        let buildTimeout: ReturnType<typeof setTimeout>;

        const child = spawn("bash", ["-c", command], { 
            cwd: dir, 
            env: { ...process.env, ...projectEnv, NODE_ENV: "production"} 
        });

        buildTimeout = setTimeout(() => {
            child.kill();
            log.error('Build timeout after 30 minutes');
            log.close();
        }, BUILD_TIMEOUT);

        child.stdout.on("data", (data) => {
            log.info(data.toString());
        });

        child.stderr.on("data", (data) => {
            log.error(data.toString());
        });

        child.on("close", (code) => {
            clearTimeout(buildTimeout);
            activeBuilds.delete(buildKey);
            
            log.info(`Child process exited with code ${code}`);
            
            if (code === 0) {
                log.close();
                // promotePreview({ appName, level, release });
            } else {
                log.error(`Build failed with code ${code}`);
                log.close();
            }
        });

        return {
            success: true,
            message: "Deployment built successfully | see build log for details",
        }
    } catch (error) {
        activeBuilds.delete(buildKey);
        return {
            status: 400,
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

export default deploymentReleaseBuild