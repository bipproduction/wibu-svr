import AppV2 from "@/lib/api/v2/util/app-v2";
import dedent from "dedent";
import toast from "react-simple-toasts";
import { proxy } from "valtio";
import overviewState from "./state_overview";


const createProjectState = proxy({
    form: {
        githubRepo: "",
        projectName: "",
        envVariables: dedent`
        # Environment Variables
    
        # Add your environment variables here
    
        # Example:
        # MY_VARIABLE=value
      `,
    },
    loading: false,
    async handleDeploy() {
        this.loading = true;
        if (
            this.form.githubRepo.length === 0 ||
            this.form.projectName.length === 0 ||
            this.form.envVariables.length === 0
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            const { status, data } = await AppV2.api.v2.projects.create.post({
                name: this.form.projectName,
                repository: this.form.githubRepo,
                envVariables: this.form.envVariables,
            });

            if (status !== 200 || data?.status !== 200) {
                alert(data?.message);
                return;
            }
            toast("Project created and deployed successfully");
            overviewState.isCreateOpen = false;
            overviewState.loadProjects();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            this.loading = false;
        }
    },
});

export default createProjectState;