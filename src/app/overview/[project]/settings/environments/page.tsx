/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AppV2 from "@/utils/app-v2";
import {
  Box,
  Button,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { proxy, useSnapshot } from "valtio";

const envGroupExample = {
  id: "production",
  name: "production",
  createdAt: "2025-01-10T21:54:04.855Z",
  updatedAt: "2025-01-10T21:54:04.855Z",
  envItem: [
    {
      id: "a5ccfaa4-2672-472b-ad28-1da6dc7e4025",
      text: "",
      projectId: "f0384700-3f20-4ecf-951b-278f0e8f810a",
      envGroupId: "production",
      createdAt: "2025-01-10T23:09:31.273Z",
      updatedAt: "2025-01-10T23:12:45.173Z",
    },
  ],
};

type EnvGroup = typeof envGroupExample;

const stateEnv = proxy<{
  envGroups: EnvGroup[] | null;
  selectedEnvGroup: number;
  envText: string;
}>({
  envGroups: null,
  selectedEnvGroup: 0,
  envText: "",
});

export default function Page() {
  const { project } = useParams();
  const { envGroups, selectedEnvGroup, envText } = useSnapshot(stateEnv);
  const [loading, setLoading] = useState(false);

  const loadEnvGroups = useCallback(async () => {
    if (!project) return;
    const { data } = await AppV2.api.v2.projects.envs["env-find-uniq"]({
      projectId: project as string,
    }).get();
    stateEnv.envGroups = data?.data as any;
  }, [project]);

  useShallowEffect(() => {
    loadEnvGroups();
  }, []);

  async function handleUpdateEnv(id: string, envText: string) {
    setLoading(true);
    try {
      const { data } = await AppV2.api.v2.projects.envs["env-update"].put({
        id,
        envText,
      });
      if (data) {
        alert("Env updated");
        loadEnvGroups();
      }
    } catch (error) {
      alert("Error updating env");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEnv(
    projectId: string,
    envGroup: string,
    envText: string
  ) {
    setLoading(true);
    try {
      const { data } = await AppV2.api.v2.projects.envs["env-create"].post({
        projectId,
        envGroup,
        envText,
      });
    } catch (error) {
      alert("Error creating env");
    } finally {
      setLoading(false);
    }
  }

  if (!envGroups) return <Skeleton h={"100%"} />;

  return (
    <Stack gap={"md"}>
      <Stack gap={"0"}>
        <Title order={3}>Environments & Variables</Title>
        <Text>
          Add environments to your project. You can add multiple environments to
          your project.
        </Text>
      </Stack>
      <Text>
        Add variables to your project. You can add multiple variables to your
        project.
      </Text>
      <Button.Group>
        {envGroups.map((envGroup, key: number) => (
          <Button
            color={selectedEnvGroup === key ? "gray.7" : "gray.9"}
            w={200}
            key={key}
            onClick={() => {
              stateEnv.selectedEnvGroup = key;
            }}
          >
            <Text>{envGroup.name}</Text>
          </Button>
        ))}
      </Button.Group>
      {!envGroups[selectedEnvGroup].envItem.length && (
        <Stack>
          <Text>No variables found create one</Text>
          <Editor
            theme="vs-dark"
            height="300px"
            defaultLanguage="python"
            onChange={(value) => {
              stateEnv.envText = value || "";
            }}
          />
          <Group justify={"flex-end"}>
            <Button
              loading={loading}
              onClick={() =>
                handleCreateEnv(
                  project as string,
                  envGroups[selectedEnvGroup].id,
                  envText
                )
              }
            >
              Create
            </Button>
          </Group>
        </Stack>
      )}
      {envGroups[selectedEnvGroup]?.envItem.map((envItem, key: number) => {
        return (
          <Stack key={key}>
            <Group justify={"flex-end"}>
              <Button
                onClick={() => handleUpdateEnv(envItem.id, envText)}
                display={
                  envText.trim() === "" ||
                  envText.trim() === envItem.text.trim()
                    ? "none"
                    : "block"
                }
              >
                Save
              </Button>
            </Group>
            <Box pos={"relative"}>
              <Editor
                theme="vs-dark"
                height="300px"
                defaultLanguage="python"
                onChange={(value) => {
                  stateEnv.envText = value || "";
                }}
                value={envItem.text.trim()}
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
              />
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}
