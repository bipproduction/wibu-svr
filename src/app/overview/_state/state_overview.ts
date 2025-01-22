/* eslint-disable @typescript-eslint/no-explicit-any */
import AppV2 from "@/lib/api/v2/util/app-v2";
import { Project } from "@prisma/client";
import { proxy } from "valtio";

const overviewState = proxy<{
    search: string;
    isCreateOpen: boolean;
    projects: Project[];
    loading: boolean;
    loadProjects: () => Promise<void>;
}>({
    search: "",
    isCreateOpen: false,
    projects: [],
    loading: false,
    async loadProjects() {
        const { data } = await AppV2.api.v2.projects["find-many"].get();
        console.log(JSON.stringify(data?.data, null, 2));
        if (data?.status !== 200) {
            alert(data?.message);
            return;
        }
        overviewState.projects = data.data as any;
    }
});

export default overviewState;