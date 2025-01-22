import AppV2 from "@/lib/api/v2/util/app-v2";
import _ from "lodash";
import { proxy } from "valtio";

export const stateFormCreate = proxy<{
    domain: string;
    subDomain: string;
    ports: number[];
    loadingPorts: boolean;
    loadPorts: () => Promise<void>;
    count: number;
    create: () => Promise<void>;
}>({
    domain: "",
    subDomain: "",
    ports: [],
    loadingPorts: false,
    count: 1,
    async loadPorts() {
        try {
            stateFormCreate.loadingPorts = true;
            const { data } = await AppV2.api.v2.utils["port-find-available"]({
                count: stateFormCreate.count,
            }).get();
            stateFormCreate.ports = data ?? [];
        } finally {
            stateFormCreate.loadingPorts = false;
        }
    },
    async create() {
        try {
            stateFormCreate.loadingPorts = true;
            if (
                stateFormCreate.domain === "" ||
                stateFormCreate.subDomain === "" ||
                !stateFormCreate.ports.length
            ) {
                alert("Please fill all fields");
                return;
            }

            const res = await AppV2.api.v2.settings.domains["config-create"].post({
                domain: stateFormCreate.domain,
                subDomain: _.kebabCase(stateFormCreate.subDomain),
                ports: stateFormCreate.ports,
            });

            if (res.status !== 200) {
                alert(res.data?.message);
                return;
            }

            window.location.href = `/settings/domains`;
        } finally {
            stateFormCreate.loadingPorts = false;
        }
    },
});