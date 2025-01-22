import Elysia, { t } from "elysia";
import projectBranchFindMany from "./project-branch-find-many";
import projectBranchOnlyFindMany from "./project-branch-only-find-many";
import projectBranchSyncAll from "./project-branch-sync-all";
import projectCommitByBranchFindMany from "./project-commit-by-branch-find-many";
import projectCommitFindMany from "./project-commit-find-many";
import projectCommitSyncByBranch from "./project-commit-sync-by-branch";
import projectCreate from "./project-create";
import projectDeploy from "./project-deploy";
import projectDeploymentsFindMany from "./project-deployments-find-many";
import projectEnvCreate from "./project-env-create";
import projectEnvFindUniq from "./project-env-find-uniq";
import projectEnvUpdate from "./project-env-update";
import projectFindFirst from "./project-find-first";
import projectFindMany from "./project-find-many";
import projectFindUnique from "./project-find-uniq";
import projectRemove from "./project-remove";
import projectUpdate from "./project-update";
import projectBuildLogFindUniq from "./project-build-log-find-uniq";
import projectDeployLogFindUniq from "./project-deploy-log-find-uniq";
import projectPromote from "./project-promote";
import projectPortFindMany from "./project-port-find-many";
import projectPortCreate from "./project-port-create";
import projectPortFindUniq from "./project-port-find-uniq";
import projectConfigFindUniq from "./project-config-find-uniq";
import projectConfigTextFindUniq from "./project-config-text-find-uniq";
import projectDomainsFindUniq from "./project-subdomains-find-uniq";
import projectSubdomainsCreate from "./project-subdomains-create";
import projectSubdomainsFindMany from "./project-subdomains-find-many";

// Deployments
const deployments = new Elysia({
    prefix: '/deployments', detail: {
        tags: ['Projects/Deployments']
    }

}).get('/find-many/:projectId', ({ params }) => {
    return projectDeploymentsFindMany({ projectId: params.projectId })
})

// Commit
const commit = new Elysia({
    prefix: '/commits', detail: {
        tags: ['Projects/Commits']
    }
})
    .get('/commit-by-branch-find-many/:projectId/:branchId', ({ params }) => {
        return projectCommitByBranchFindMany({ projectId: params.projectId, branchId: params.branchId })
    })
    .patch('/commit-sync-by-branch/:projectId/:branchId', ({ params }) => {
        return projectCommitSyncByBranch({ projectId: params.projectId, branchId: params.branchId })
    })
    .get('/commit-find-many/:projectId', ({ params }) => {
        return projectCommitFindMany({ projectId: params.projectId })
    })

// Domain
const domain = new Elysia({
    prefix: '/domains', detail: {
        tags: ['Projects/Domains']
    }
})
    .get('/project-domains-find-uniq/:projectId/:envGroupId/:serverConfigId', ({ params }) => {
        return projectDomainsFindUniq({ projectId: params.projectId, envGroupId: params.envGroupId, serverConfigId: params.serverConfigId })
    })
    .post('/project-subdomains-create', async ({ body, set }) => {
        const res = await projectSubdomainsCreate({ projectId: body.projectId, envGroupId: body.envGroupId, serverConfigId: body.serverConfigId, domainId: body.domainId })
        set.status = res.status
        return res
    }, {
        body: t.Object({
            projectId: t.String(),
            envGroupId: t.String(),
            serverConfigId: t.String(),
            domainId: t.String()
        })
    })
    .get('/project-subdomains-find-many/:projectId', async ({ params, set }) => {
        const res = await projectSubdomainsFindMany({ projectId: params.projectId })
        set.status = res.status
        return res
    })

// Branch
const branch = new Elysia({
    prefix: '/branches', detail: {
        tags: ['Projects/Branches']
    }
})
    .get('/branch-find-many/:projectId', ({ params }) => {
        return projectBranchFindMany({ projectId: params.projectId })
    })
    .get('/branch-find-many/:projectId', ({ params }) => {
        return projectBranchFindMany({ projectId: params.projectId })
    })
    .patch('/branch-sync-all/:projectId', ({ params }) => {
        return projectBranchSyncAll({ projectId: params.projectId })
    })
    .get('/branch-only-find-many/:projectId', ({ params }) => {
        return projectBranchOnlyFindMany({ projectId: params.projectId })
    })

// Env
const env = new Elysia({
    prefix: '/envs', detail: {
        tags: ['Projects/Envs']
    }
})
    .get('/env-find-uniq/:projectId', ({ params }) => {
        return projectEnvFindUniq({ projectId: params.projectId })
    })
    .put('/env-update', ({ body }) => projectEnvUpdate({ body }), {
        body: t.Object({
            id: t.String(),
            envText: t.String()
        })
    })
    .post('/env-create', ({ body }) => projectEnvCreate({ body }), {
        body: t.Object({
            projectId: t.String(),
            envGroup: t.String(),
            envText: t.String()
        })
    })


// Build
const build = new Elysia({
    prefix: '/build', detail: {
        tags: ['Projects/Build']
    }
})
    .get('/build-log-find-uniq/:projectId/:commitId', ({ params }) => {
        return projectBuildLogFindUniq({ projectId: params.projectId, commitId: params.commitId })
    }, {
        params: t.Object({
            projectId: t.String(),
            commitId: t.String()
        })
    })

const deploy = new Elysia({
    prefix: '/deploy', detail: {
        tags: ['Projects/Deploy']
    }
})
    .post('/deploy/:commitId', async ({ params }) => {
        return projectDeploy({ commitId: params.commitId })
    })
    .get('/log/:projectId/:commitId', ({ params }) => {
        return projectDeployLogFindUniq({ projectId: params.projectId, commitId: params.commitId })
    })

const Projects = new Elysia({
    prefix: '/projects', detail: {
        tags: ['Projects']
    }
})
    .use(deployments)
    .use(commit)
    .use(branch)
    .use(env)
    .use(build)
    .use(deploy)
    .use(domain)
    .get('/find-many', projectFindMany)
    .get('/find-first', projectFindFirst)
    .get('/find-unique/:id', ({ params }) => {
        return projectFindUnique({ id: params.id })
    })
    .post('/create', projectCreate)
    .put('/update/:id', projectUpdate)
    .delete('/remove/:id', projectRemove)
    .post('/promote/:projectId/:commitId/:envGroupId', ({ params }) => {
        return projectPromote({ projectId: params.projectId, commitId: params.commitId, envGroupId: params.envGroupId })
    })
    .get('/port/find-many/:projectId/:envGroupId', ({ params }) => {
        return projectPortFindMany({ projectId: params.projectId, envGroupId: params.envGroupId })
    })
    .post('/port/create/:projectId/:envGroupId', ({ params, body }: { params: { projectId: string, envGroupId: string }, body: { ports: number[] } }) => {
        return projectPortCreate({ projectId: params.projectId, envGroupId: params.envGroupId, ports: body.ports })
    }, {
        params: t.Object({
            projectId: t.String(),
            envGroupId: t.String()
        }),
        body: t.Object({
            ports: t.Array(t.Number())
        })
    })
    .get('/port/find-uniq/:projectId/:envGroupId', ({ params }) => {
        return projectPortFindUniq({ projectId: params.projectId, envGroupId: params.envGroupId })
    })
    .get('/config/find-uniq/:projectId', ({ params }) => {
        return projectConfigFindUniq({ projectId: params.projectId })
    })
    .get('/config/text/find-uniq/:projectId/:envGroupId', ({ params }) => {
        return projectConfigTextFindUniq({ projectId: params.projectId, envGroupId: params.envGroupId })
    })




export default Projects;