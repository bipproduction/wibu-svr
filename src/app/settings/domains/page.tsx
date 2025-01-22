"use client";

import {
  Button,
  Flex,
  Loader,
  SimpleGrid,
  Stack,
  Tabs,
  Title,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { ServerConfig } from "@prisma/client";
import { useRouter } from "next/navigation";
import { use } from "react";
import { FaCloudDownloadAlt, FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { toastConfig } from "react-simple-toasts";
import { useSnapshot } from "valtio";
import DomainContent from "./_com/DomainContent";
import { stateDomains } from "./_state/stste_domains";
import DomainPull from "./_com/DomainPull";
import DomainPush from "./_com/DomainPush";
import CreateSubDomainModal from "./_com/CreateSubdomainModal";
import DomainConfigUpdate from "./_com/DomainConfigUpdate";
import { Editor } from "@monaco-editor/react";

toastConfig({
  position: "bottom-center",
  theme: "dark",
});

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ create: string }>;
}) {
  const domains = useSnapshot(stateDomains);
  const router = useRouter();
  const isCreate = use(searchParams).create === "true";

  useShallowEffect(() => {
    stateDomains.load();
    stateDomains.localConfig.load();
  }, []);

  if (!domains.data.length) return <Loader />;
  if (isCreate) return <CreateSubDomainModal />;
  if (domains.isPush) return <DomainPush />;
  if (domains.isPull) return <DomainPull />;
  if (domains.update.data) return <DomainConfigUpdate />;
  return (
    <Stack p={"md"}>
      <Flex justify="space-between" gap={"sm"}>
        <Title order={2}>Domains</Title>
        <Button.Group>
          <Button
            onClick={() => (stateDomains.isPush = true)}
            variant="light"
            leftSection={<FaCloudUploadAlt />}
          >
            Push
          </Button>
          <Button
            onClick={() => (stateDomains.isPull = true)}
            variant="light"
            leftSection={<FaCloudDownloadAlt />}
          >
            Pull
          </Button>
          <Button
            onClick={() => router.push(`/settings/domains?create=true`)}
            leftSection={<FaPlus />}
            variant="light"
          >
            Add Domain
          </Button>
        </Button.Group>
      </Flex>
      <SimpleGrid
        cols={{
          base: 1,
          md: 2,
        }}
      >
        <Stack>
          <Title order={3}>Remote Config</Title>
          <Tabs defaultValue={domains.data[0].name}>
            <Tabs.List>
              {domains.data.map((domain, key) => (
                <Tabs.Tab
                  key={key}
                  value={domain.name}
                  onClick={() => (stateDomains.selectedDomain = key)}
                >
                  {domain.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Tabs.Panel value={domains.data[domains.selectedDomain].name}>
              <Stack p={"md"}>
                <SimpleGrid
                  cols={{
                    base: 1,
                    md: 2,
                  }}
                >
                  {domains.data[domains.selectedDomain].ServerConfig.map(
                    (serverConfig) => (
                      <DomainContent
                        key={serverConfig.id}
                        value={serverConfig as ServerConfig}
                      />
                    )
                  )}
                </SimpleGrid>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
        <Stack>
          <Title order={3}>Local Config</Title>
          {domains.localConfig.data?.map((config, key) => (
            <Stack key={key}>
              <Title order={4}>{config.name}</Title>
              <Editor
                height={300}
                language="json"
                value={JSON.stringify(config, null, 2)}
                options={{
                  theme: "vs-dark",
                  minimap: {
                    enabled: false,
                  },
                }}
              />
            </Stack>
          ))}
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
