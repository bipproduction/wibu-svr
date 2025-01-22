/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppV2 from "@/lib/api/v2/util/app-v2";
import {
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { proxy, useSnapshot } from "valtio";
import { subscribeKey } from "valtio/utils";

const state = proxy<{
  ports: number[] | null;
  envGroup: any[] | undefined;
  selectedEnvGroup: string | undefined;
  listPort: number[] | null;
  load: {
    listPort: {
      value: string;
      reload: () => void;
    };
  };
}>({
  ports: null,
  envGroup: undefined,
  selectedEnvGroup: undefined,
  listPort: null,
  load: {
    listPort: {
      value: "xxx",
      reload() {
        this.value = Math.random().toString(36).substring(2, 15);
      },
    },
  },
});

export default function PortSettings() {
  const { envGroup, selectedEnvGroup } = useSnapshot(state);
  const { project: projectId } = useParams();

  async function loadProjectConfig() {
    if (!projectId) return;
    const { data } = await AppV2.api.v2.projects.config["find-uniq"]({
      projectId: projectId as string,
    }).get();

    // console.log(data?.data);
    state.envGroup = data?.data;
    state.selectedEnvGroup = data?.data[0].id;
  }

  useShallowEffect(() => {
    // loadEnvGroup();
    loadProjectConfig();
  }, []);

  useShallowEffect(() => {
    loadProjectConfig();
  }, []);

  if (!envGroup) return <div>Loading...</div>;

  return (
    <Stack>
      <Button.Group>
        {envGroup.map((env) => (
          <Button
            leftSection={env.hasConfig ? <FaCheck /> : <FaTimes />}
            onClick={() => {
              state.selectedEnvGroup = env.id;
            }}
            bg={selectedEnvGroup === env.id ? "blue.9" : "gray.9"}
            variant="light"
            key={env.id}
          >
            {env.name}
          </Button>
        ))}
      </Button.Group>
      <GroupPortContent
        selectedEnvGroup={selectedEnvGroup}
        projectId={projectId as string}
      />
      <DisplayConfigText
        projectId={projectId as string}
        envGroupId={selectedEnvGroup}
      />
    </Stack>
  );
}

const GroupPortContent = ({
  selectedEnvGroup,
  projectId,
}: {
  selectedEnvGroup: string | undefined;
  projectId: string | undefined;
}) => {
  const { listPort } = useSnapshot(state);

  async function loadProjectPort() {
    if (!projectId || !selectedEnvGroup) return;
    const { data } = await AppV2.api.v2.projects.port["find-uniq"]({
      projectId,
    })({ envGroupId: selectedEnvGroup }).get();
    state.listPort = data?.data?.ports as number[];
  }

  useShallowEffect(() => {
    loadProjectPort();
  }, [projectId, selectedEnvGroup]);

  useShallowEffect(() => {
    const unsubscribe = subscribeKey(state.load.listPort, "value", () => {
      loadProjectPort();
    });
    return () => unsubscribe();
  }, []);

  if (!projectId || !selectedEnvGroup)
    return <div>Please select a project and environment group</div>;

  if (!listPort) {
    return (
      <GeneratePortForm projectId={projectId} envGroupId={selectedEnvGroup} />
    );
  }
  return (
    <Card display={selectedEnvGroup ? "block" : "none"}>
      <Stack>
        {listPort.toString()}
        <Divider />
        <GeneratePortForm projectId={projectId} envGroupId={selectedEnvGroup} />
      </Stack>
    </Card>
  );
};

function GeneratePortForm({
  projectId,
  envGroupId,
}: {
  projectId: string;
  envGroupId: string;
}) {
  const [count, setCount] = useState(1);
  const [listPort, setListPort] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleGeneratePort() {
    const { data } = await AppV2.api.v2.utils["port-find-available"]({
      count,
    }).get();
    if (data) {
      setListPort(data);
    }
  }

  async function handleSavePort() {
    try {
      setLoading(true);
      if (!projectId || !envGroupId || !listPort)
        return alert("Please fill all fields");
      const { data } = await AppV2.api.v2.projects.port
        .create({ projectId })({ envGroupId })
        .post({ ports: listPort });
      if (data) {
        state.load.listPort.reload();
        alert("Port saved successfully");
        return;
      }
      alert("Failed to save port");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Stack gap={"md"}>
      <Text>Generate Port</Text>

      <TextInput
        placeholder="count"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
      />
      <Group justify="flex-end">
        <Button variant="light" onClick={handleGeneratePort}>
          Generate
        </Button>
      </Group>
      {listPort && (
        <Card bg={"gray"}>
          <Stack>
            <Text>Port List Available</Text>
            <Flex gap="xs" align="flex-start" justify="space-between">
              <Flex gap="xs" align="center" wrap="wrap">
                {listPort.map((port) => (
                  <Flex key={port}>
                    <Text>{port}</Text>
                  </Flex>
                ))}
              </Flex>
              <Button
                variant="light"
                loading={loading}
                onClick={handleSavePort}
                w={100}
              >
                Save
              </Button>
            </Flex>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}

function DisplayConfigText({
  projectId,
  envGroupId,
}: {
  projectId: string;
  envGroupId: string | undefined;
}) {
  const [configText, setConfigText] = useState<string | null>(null);
  async function loadConfigText() {
    if (!projectId || !envGroupId) return;
    const { data } = await AppV2.api.v2.projects.config.text["find-uniq"]({
      projectId: projectId,
    })({ envGroupId: envGroupId }).get();
    if (data) {
      setConfigText(JSON.stringify(data.data, null, 2));
    }
  }

  useShallowEffect(() => {
    loadConfigText();
  }, [projectId, envGroupId]);

  useShallowEffect(() => {
    const unsubscribe = subscribeKey(state.load.listPort, "value", () => {
      loadConfigText();
    });
    return () => unsubscribe();
  }, []);

  return (
    <Stack>
      <Text>Config Text</Text>
      <Editor
        height="500px"
        theme="vs-dark"
        value={configText || ""}
        language="json"
        options={{
          minimap: { enabled: false },
          readOnly: true,
        }}
      />
    </Stack>
  );
}
