import os from 'os'
import path from 'path'
import readdirp from 'readdirp'
import projectConfig from "@/project.config"
async function deploymentProcessConfigFindMany({ appName }: { appName: string }) {
    const configPath = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, "configs")
    const configs = []
    for await (const entry of readdirp(configPath, {
        depth: 1,
        fileFilter: (entry) => entry.path.endsWith('.json')
    })) {
        configs.push({
            appName: appName,
            type: path.basename(entry.path).replace(".json", ""),
            level: path.basename(path.dirname(entry.path))
        })
    }
    return configs
}

export default deploymentProcessConfigFindMany