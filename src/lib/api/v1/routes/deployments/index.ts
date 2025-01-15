import Elysia from "elysia";

import deploymentCreate from "@/lib/api/v1/routes/deployments/lib/deployment-create";
import deploymentFindMany from "@/lib/api/v1/routes/deployments/lib/deployment-find-many";
import deploymentFindRepoSync from "@/lib/api/v1/routes/deployments/lib/deployment-find-repo-sync";
import deploymentProcessConfigDelete from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-config-delete";
import deploymentProcessConfigFind from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-config-find";
import deploymentProcessConfigFindMany from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-config-find-many";
import deploymentProcessConfigGenerate from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-config-generate";
import deploymentProcessConfigUpdate from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-config-update";
import deploymentProcessDelete from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-delete";
import deploymentProcessJlist from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-jlist";
import deploymentProcessLogClear from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-log-clear";
import deploymentProcessLogFind from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-log-find";
import deploymentProcessLogFindMany from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-log-find-many";
import deploymentProcessStart from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-start";
import deploymentProcessStop from "@/lib/api/v1/routes/deployments/lib/process/deployment-process-stop";
import deploymentReleaseBuild from "@/lib/api/v1/routes/deployments/lib/release/deployment-release-build";
import deploymentReleaseBuildLogFind from "@/lib/api/v1/routes/deployments/lib/release/deployment-release-build-log-find";
import deploymentReleaseBuildLogFindMany from "@/lib/api/v1/routes/deployments/lib/release/deployment-release-build-log-find-many";
import deploymentReleaseFindMany from "@/lib/api/v1/routes/deployments/lib/release/deployment-release-find-many";
import deploymentReleasePromote from "@/lib/api/v1/routes/deployments/lib/release/deployment-release-promote";
import { PM2Config } from "@/types/Pm2Config";
import deploymentRemove from "./lib/deployment-remove";
import deploymentReleaseRemove from "./lib/release/deployment-release-remove";


const deployments = new Elysia({ prefix: "/api/v1/deployments" })
    .get("/find-many", () => {
        return deploymentFindMany();
    }, {
        detail: {
            tags: ["deployments"],
            description: "deployment find many",
            summary: "deployment find many"
        }
    })
    .post("/create/:appName/:level", ({ params }: { params: { appName: string, level: string } }) => {
        return deploymentCreate({ appName: params.appName, level: params.level });
    }, {
        detail: {
            tags: ["deployments"],
            description: "deployment create",
            summary: "deployment create"
        }
    })
    .delete("/remove/:appName", ({ params }: { params: { appName: string } }) => {
        return deploymentRemove({ appName: params.appName });
    }, {
        detail: {
            tags: ["deployments"],
            description: "deployment delete",
            summary: "deployment delete"
        }
    })
    .get("/repo-sync/find/:appName/:level", ({ params }: { params: { appName: string, level: string } }) => {
        return deploymentFindRepoSync({ appName: params.appName, level: params.level });
    }, {
        detail: {
            tags: ["deployments"],
            description: "deployment repo sync find",
            summary: "deployment repo sync find"
        }
    })  
    // release
    .get("/release/find-many/:appName/:level", ({ params }: { params: { appName: string, level: string } }) => {
        return deploymentReleaseFindMany({ appName: params.appName, level: params.level });
    }, {
        detail: {
            tags: ["deployments"],
            description: "release find many",
            summary: "release find many"
        }
    })
    .get("/release/build-log/find/:appName/:fileName", ({ params }: { params: { appName: string, fileName: string } }) => {
        return deploymentReleaseBuildLogFind({ appName: params.appName, fileName: params.fileName });
    }, {
        detail: {
            tags: ["deployments"],
            description: "release build log find",
            summary: "release build log find"
        }
    })
    .get("/release/build-log/find-many/:appName", ({ params }: { params: { appName: string } }) => {
        return deploymentReleaseBuildLogFindMany({ appName: params.appName });
    }, {
        detail: {
            tags: ["deployments"],
            description: "release build log find many",
            summary: "release build log find many"
        }
    })
    .post("/release/build/:appName/:level/:release", ({ params }: { params: { appName: string, level: string, release: string } }) => {
        return deploymentReleaseBuild({ appName: params.appName, level: params.level, release: params.release });
    }, {
        detail: {
            tags: ["deployments"],
            description: "release build",
            summary: "release build"
        }
    })
    .post("/release/promote/:appName/:level/:type/:release", ({ params }: { params: { appName: string, level: string, type: string, release: string } }) => {
        return deploymentReleasePromote({ appName: params.appName, level: params.level, type: params.type, release: params.release });
    }, {
        detail: {
            tags: ["deployments"],
            description: "release promote",
            summary: "release promote"
        }
    })
    .delete("/release/remove/:appName/:level/:release", ({ params }: { params: { appName: string, level: string, release: string } }) => {
        return deploymentReleaseRemove({ appName: params.appName, level: params.level, release: params.release });
    }, {
        detail: {
            tags: ["deployments"],
            description: "release remove",
            summary: "release remove"
        }
    })
    .post("/process-config/generate/:appName/:level", ({ params }: { params: { appName: string, level: string } }) => {
        return deploymentProcessConfigGenerate({ appName: params.appName, level: params.level });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process config generate",
            summary: "process config generate"
        }
    })
    .get("/process-config/find/:appName/:level/:type", ({ params }: { params: { appName: string, level: string, type: string } }) => {
        return deploymentProcessConfigFind({ appName: params.appName, level: params.level, type: params.type });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process config find",
            summary: "process config find"
        }
    })
    .get("/process-config/find-many/:appName", ({ params }: { params: { appName: string } }) => {
        return deploymentProcessConfigFindMany({ appName: params.appName });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process config find many",
            summary: "process config find many"
        }
    })
    .delete("/process-config/delete/:appName/:level/:fileName", ({ params }: { params: { appName: string, level: string, fileName: string } }) => {
        return deploymentProcessConfigDelete({ appName: params.appName, level: params.level, fileName: params.fileName });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process config delete",
            summary: "process config delete"
        }
    })
    .post("/process/config/update/:appName/:level/:type", ({ params, body }: { params: { appName: string, level: string, type: string }, body: PM2Config }) => {
        return deploymentProcessConfigUpdate({ appName: params.appName, level: params.level, type: params.type, config: body });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process config update",
            summary: "process config update"
        }
    })
    .post("/process/start/:appName/:level/:type", ({ params }: { params: { appName: string, level: string, type: string } }) => {
        return deploymentProcessStart({ appName: params.appName, level: params.level, type: params.type });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process start",
            summary: "process start"
        }
    })
    .post("/process/stop/:appName/:level/:type", ({ params }: { params: { appName: string, level: string, type: string } }) => {
        return deploymentProcessStop({ appName: params.appName, level: params.level, type: params.type });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process stop",
            summary: "process stop"
        }
    })
    .delete("/process/remove/:appName/:level/:type", ({ params }: { params: { appName: string, level: string, type: string } }) => {
        return deploymentProcessDelete({ appName: params.appName, level: params.level, type: params.type });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process remove",
            summary: "process remove"
        }
    })
    .get("/process/jlist", () => {
        return deploymentProcessJlist();
    }, {
        detail: {
            tags: ["deployments"],
            description: "process jlist",
            summary: "process jlist"
        }
    })
    .get("/process/log/find-many/:appName", ({ params }: { params: { appName: string } }) => {
        return deploymentProcessLogFindMany({ appName: params.appName });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process log find many",
            summary: "process log find many"
        }
    })
    .get("/process/log/find/:appName/:level/:type", ({ params }: { params: { appName: string, level: string, type: string } }) => {
        return deploymentProcessLogFind({ appName: params.appName, level: params.level, type: params.type });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process log find",
            summary: "process log find"
        }
    })
    .delete("/process/log/clear/:appName/:level/:type", ({ params }: { params: { appName: string, level: string, type: string } }) => {
        return deploymentProcessLogClear({ appName: params.appName, level: params.level, type: params.type });
    }, {
        detail: {
            tags: ["deployments"],
            description: "process log clear",
            summary: "process log clear"
        }
    });

export default deployments;
