/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CustomButtonFun from "@/components/CustomButtonFun";
import AppV2 from "@/lib/api/v2/util/app-v2";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
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
      <Group justify="end">
        <SelectMenuPromote
          projectId={projectId as string}
          commitId={commitId as string}
        />
      </Group>
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
          <Flex>
            <CustomButtonFun onClick={getBuildLog}>
              Get Build Log
            </CustomButtonFun>
          </Flex>
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

function SelectMenuPromote({
  projectId,
  commitId,
}: {
  projectId: string;
  commitId: string;
}) {
  const { envGroup } = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  async function loadEnvGroup() {
    const { data } = await AppV2.api.v2["env-group"]["find-many"].get();
    if (data) {
      state.envGroup = data.data;
    }
  }
  useShallowEffect(() => {
    loadEnvGroup();
  }, []);

  async function promote({
    projectId,
    commitId,
    envGroupId,
  }: {
    projectId: string;
    commitId: string;
    envGroupId: string;
  }) {
    try {
      setLoading(true);
      const { data } = await AppV2.api.v2.projects
        .promote({
          projectId: projectId,
        })({ commitId: commitId })({ envGroupId: envGroupId })
        .post();
      if (data?.success) {
        alert(data?.message);
      } else {
        alert(data?.message);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }
  if (!envGroup)
    return (
      <Group justify={"center"} align={"center"} gap={"xs"}>
        <Loader size={"xs"} />
        <Text>Loading...</Text>
      </Group>
    );
  return (
    <Card>
      <Stack gap={"md"}>
        <Flex gap={"md"} align={"center"}>
          <Box>
            <FaArrowRight />
          </Box>
          <Text>Promote to</Text>
        </Flex>
        <Button.Group>
          {envGroup.map((env) => (
            <Button
              loading={loading}
              variant="light"
              key={env.id}
              onClick={() =>
                promote({ projectId, commitId, envGroupId: env.id })
              }
            >
              {env.name}
            </Button>
          ))}
        </Button.Group>
      </Stack>
    </Card>
  );
}
