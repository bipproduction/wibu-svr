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
    .get('/find-many', projectFindMany)
    .get('/find-first', projectFindFirst)
    .get('/find-unique/:id', ({ params }) => {
        return projectFindUnique({ id: params.id })
    })
    .post('/create', projectCreate)
    .put('/update/:id', projectUpdate)
    .delete('/remove/:id', projectRemove)



export default Projects;