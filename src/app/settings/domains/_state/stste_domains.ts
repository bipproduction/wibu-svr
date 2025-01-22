/* eslint-disable @typescript-eslint/no-explicit-any */
import AppV2 from "@/lib/api/v2/util/app-v2";
import { Domain, ServerConfig } from "@prisma/client";
import toast from "react-simple-toasts";
import { proxy } from "valtio";


type StateDomains = {
    data: (Domain & { ServerConfig: ServerConfig[] })[];
    loading: boolean;
    selectedDomain: number;
    isPush: boolean;
    isPull: boolean;
    update: {
        data: {
            id: string;
            name: string;
            ports: number[];
        } | null;
        loading: boolean;
        fun: (dataBody: {
            id: string;
            name: string;
            ports: number[];
        }) => Promise<void>;
    };
    load: () => Promise<void>;
    push: ({ domainId }: { domainId: string }) => Promise<void>;
    pull: () => Promise<void>;
    remove: (id: string) => Promise<void>;
};

export interface LocalConfigData {
    name: string
    ServerConfig: {
        id: string
        domainId: string
        name: string
        ports: number[]
    }[]
}



const localConfig: {
    data: LocalConfigData[] | null;
    loading: boolean;
    load: () => Promise<void>;
} = {
    data: [],
    loading: false,
    async load() {
        const res = await AppV2.api.v2.settings.domains["config-local-find-many"].get();
        this.data = res.data?.data ?? [] as any;
    }
}


const domains: StateDomains & { localConfig: typeof localConfig } = {
    localConfig: { ...localConfig },
    data: [],
    loading: false,
    selectedDomain: 0,
    isPush: false,
    isPull: false,
    update: {
        data: null,
        loading: false,
        fun: async (dataBody: { id: string; name: string; ports: number[] }) => {
            try {
                stateDomains.update.loading = true;
                const res = await AppV2.api.v2.settings.domains["config-update"].post({
                    id: dataBody.id,
                    name: dataBody.name,
                    ports: dataBody.ports,
                });

                if (res.status !== 200) {
                    alert(res.data?.message);
                    return;
                }

                stateDomains.load();
                toast("Config updated successfully");
            } catch (error) {
                console.error(error);
            } finally {
                stateDomains.update.loading = false;
            }
        },
    },
    load: async () => {
        try {
            stateDomains.loading = true;
            const res = await AppV2.api.v2.settings.domains["find-many"].get();
            stateDomains.data = res.data?.data ?? [] as any;
        } catch (error) {
            console.error(error);
        } finally {
            stateDomains.loading = false;
        }
    },
    push: async ({ domainId }: { domainId: string }) => {
        if (!domainId || domainId === "") {
            alert("Please select a domain");
            return;
        }

        try {
            stateDomains.loading = true;
            const res = await AppV2.api.v2.settings.domains
                .push({
                    domainId,
                })
                .post();

            if (res.status !== 200) {
                alert(res.data?.message);
                return;
            }

            stateDomains.load();
            toast("Domains pushed successfully");
        } catch (error) {
            console.error(error);
        } finally {
            stateDomains.loading = false;
        }
    },
    pull: async () => {
        try {
            stateDomains.loading = true;
            const res = await AppV2.api.v2.settings.domains.pull.get();

            if (res.status !== 200) {
                alert(res.data?.message);
                return;
            }

            toast("Domains pulled successfully");
            stateDomains.load();
        } catch (error) {
            console.error(error);
        } finally {
            stateDomains.loading = false;
        }
    },
    remove: async (id: string) => {
        try {
            stateDomains.loading = true;
            const res = await AppV2.api.v2.settings.domains["config-remove"]({
                id,
            }).delete();

            if (res.status !== 200) {
                alert(res.data?.message);
                return;
            }

            stateDomains.load();
        } catch (error) {
            console.error(error);
        } finally {
            stateDomains.loading = false;
        }
    },
}

export const stateDomains = proxy(domains);