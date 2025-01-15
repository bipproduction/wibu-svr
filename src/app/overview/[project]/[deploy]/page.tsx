/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CustomButtonFun from "@/components/CustomButtonFun";
import AppV2 from "@/utils/app-v2";
import {
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Menu,
  Stack,
  Text
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { Editor } from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { proxy, useSnapshot } from "valtio";

const state = proxy<{
  buildLog: string | null;
  envGroup: any[] | null;
}>({
  buildLog: null,
  envGroup: null,
});
export default function DeployPage() {
  const { project: projectId, deploy: commitId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { buildLog } = useSnapshot(state);

  async function getBuildLog() {
    const { data } = await AppV2.api.v2.projects.deploy
      .log({
        projectId: projectId as string,
      })({
        commitId: commitId as string,
      })
      .get();
    console.log(data, "data");
    state.buildLog = data?.stringLog || null;
  }

  useShallowEffect(() => {
    getBuildLog();
  }, []);

  async function redeploy() {
    try {
      setLoading(true);
      const { data } = await AppV2.api.v2.projects.deploy
        .deploy({
          commitId: commitId as string,
        })
        .post();

      if (!data?.success) {
        alert(data?.message);
        return;
      }
      alert(data?.message);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Stack>
      <SelectMenuPromote />
      <Flex p={"xs"} justify={"flex-start"}>
        <CustomButtonFun
          leftSection={<FaArrowLeft />}
          onClick={() => router.back()}
        >
          Back
        </CustomButtonFun>
        <CustomButtonFun loading={loading} onClick={redeploy}>
          Redeploy
        </CustomButtonFun>
      </Flex>
      <Divider />
      <Container
        w={{
          base: "100%",
          md: "80%",
        }}
      >
        <Stack>
          <Text>Deploy</Text>
          <Text>{projectId}</Text>
          <Text>{commitId}</Text>
          <Group>
            <CustomButtonFun onClick={getBuildLog}>
              Get Build Log
            </CustomButtonFun>
          </Group>
          <Editor
            value={buildLog || ""}
            language="text"
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: {
                enabled: false,
              },
            }}
            height={500}
          />
        </Stack>
      </Container>
    </Stack>
  );
}

function SelectMenuPromote() {
  const { envGroup } = useSnapshot(state);
  async function loadEnvGroup() {
    const { data } = await AppV2.api.v2["env-group"]["find-all"].get();
    if (data) {
      state.envGroup = data.data;
    }
  }
  useShallowEffect(() => {
    loadEnvGroup();
  }, []);
  if (!envGroup)
    return (
      <Group justify={"center"} align={"center"} gap={"xs"}>
        <Loader size={"xs"} />
        <Text>Loading...</Text>
      </Group>
    );
  return (
    <Stack gap={0}>
      <Menu>
        <Menu.Target>
          <CustomButtonFun leftSection={<FaArrowRight />}>
            Promote
          </CustomButtonFun>
        </Menu.Target>
        <Menu.Dropdown>
          {envGroup.map((env) => (
            <Menu.Item key={env.id}>{env.name}</Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Stack>
  );
}
