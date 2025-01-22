/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppV2 from "@/lib/api/v2/util/app-v2";
import {
  ActionIcon,
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { EnvGroup, ProjectSubDomain } from "@prisma/client";
import { useParams } from "next/navigation";

import { MdOutlineWeb, MdRefresh } from "react-icons/md";
import { toast } from "react-simple-toasts";
import { proxy, useSnapshot } from "valtio";
import { DataEnvProjectDomain } from "./_ast/data-env-project-domain";

interface Domains {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ServerConfig: ServerConfig[];
}

export interface ServerConfig {
  id: string;
  name: string;
  domainId: string;
  ports: number[];
  createdAt: string;
  updatedAt: string;
}

const domain = {
  data: [] as Domains[],
  loading: false,
  async load() {
    this.loading = true;
    const { data } = await AppV2.api.v2.settings.domains["find-many"].get();
    this.data = data?.data as any[];
    this.loading = false;
  },
};

const envGroup = {
  data: [] as EnvGroup[],
  loading: false,
  async load() {
    const { data } = await AppV2.api.v2["env-group"]["find-many"].get();
    console.log(data);
    this.data = data?.data as any[];
    this.loading = false;
  },
};

const projectDomains = {
  data: {} as ProjectSubDomain | undefined,
  create: {
    loading: false,
    async connect({
      projectId,
      envGroupId,
      domainId,
      serverConfigId,
    }: {
      projectId: string;
      envGroupId: string;
      domainId: string;
      serverConfigId: string;
    }) {
      this.loading = true;
      const { data, status } = await AppV2.api.v2.projects.domains[
        "project-subdomains-create"
      ].post({
        projectId,
        envGroupId,
        domainId,
        serverConfigId,
      });

      if (status === 200) {
        toast(data?.message);
      } else {
        toast(data?.message);
      }
      this.loading = false;
    },
  },
  findUnique: {
    loading: false,
    async find({
      projectId,
      envGroupId,
      serverConfigId,
    }: {
      projectId: string;
      envGroupId: string;
      serverConfigId: string;
    }) {
      this.loading = true;
      const { data } = await AppV2.api.v2.projects.domains[
        "project-domains-find-uniq"
      ]({ projectId })({ envGroupId })({ serverConfigId }).get();
      this.loading = false;
      projectDomains.data = data?.data;
    },
  },
};

const dataEnvProjectDomain = {
  data: null as DataEnvProjectDomain | null,
  loading: false,
  async load({ projectId }: { projectId: string }) {
    this.loading = true;
    const { data } = await AppV2.api.v2.projects.domains[
      "project-subdomains-find-many"
    ]({ projectId }).get();
    this.data = data?.data as DataEnvProjectDomain;
    this.loading = false;
  },
};

const stateDomains = proxy({
  selectedTab: 0,
  domains: domain,
  envGroupState: envGroup,
  projectDomains,
  dataEnvProjectDomain,
});

export default function Page() {
  const snap = useSnapshot(stateDomains);
  const { project: projectId } = useParams();
  useShallowEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await stateDomains.domains.load();
    await stateDomains.envGroupState.load();
    await stateDomains.dataEnvProjectDomain.load({
      projectId: projectId as string,
    });
  }

  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Title order={2}>Domains</Title>
        <ActionIcon onClick={() => loadData()} radius={100}>
          <MdRefresh />
        </ActionIcon>
      </Flex>
      <Stack>
        {snap.dataEnvProjectDomain.data &&
          snap.dataEnvProjectDomain.data.envGroup.map((env) => (
            <Card key={env.id}>
              <Stack>
                <Title order={3}>{env.name}</Title>
                <SimpleGrid cols={2}>
                  {snap.dataEnvProjectDomain.data?.domains.map((domain) => (
                    <Stack key={domain.id}>
                      <Flex align="center" gap={5}>
                        <MdOutlineWeb />
                        <Text>{domain.name}</Text>
                      </Flex>
                      <Divider />
                      {domain.ServerConfig.map((server) => (
                        <Text key={server.id}>{server.name}</Text>
                      ))}
                    </Stack>
                  ))}
                </SimpleGrid>
              </Stack>
            </Card>
          ))}
      </Stack>
    </Stack>
  );
}
