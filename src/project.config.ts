import path from "path";
import os from "os";


const projectConfig = {
    projectRootDir: "wibu-svr",
    nextPublicUrl: "http://85.31.224.193:3002",
    apiVersion: "v1",
    pathPrefix: {
        overviews: "overviews",
        deployments: "deployments",
        logs: "logs",
        pm2: "pm2",
        deployed: "deployed",
        apps: "apps",
        configs: "configs",
        toLog: (appName: string) => path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, projectConfig.pathPrefix.apps, appName, projectConfig.pathPrefix.logs),
        toConfig: (appName: string) => path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, projectConfig.pathPrefix.apps, appName, projectConfig.pathPrefix.configs),
        toDeployed: (appName: string) => path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, projectConfig.pathPrefix.apps, appName, projectConfig.pathPrefix.deployed),
    },
    fileExtension: ".wibu",
};

export default projectConfig;
