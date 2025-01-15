/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  Loader,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  FaCalendarAlt,
  FaCodeBranch,
  FaGithub,
  FaPlay,
  FaSearch,
  FaUser,
} from "react-icons/fa";

// import css date picker mantine
import CustomButtonFun from "@/components/CustomButtonFun";
import AppV2 from "@/utils/app-v2";
import "@mantine/dates/styles.css";
import { useShallowEffect } from "@mantine/hooks";
import moment from "moment";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { proxy, useSnapshot } from "valtio";

const deploymenExample = {
  id: "9e46d9019fd6060331fa33f392314f126c7f56a6",
  sha: "9e46d9019fd6060331fa33f392314f126c7f56a6",
  author: "bipproduction",
  email: "bip.production.js@gmail.com",
  date: "2024-12-10T20:32:14.000Z",
  message: "tambahan baru",
  url: "https://github.com/bipproduction/wibu-storage/commit/9e46d9019fd6060331fa33f392314f126c7f56a6",
  projectId: "04883b2e-0685-44f0-b737-bdc465a351de",
  branchId: "083b5137-d5ad-4274-aafb-478439acd569",
  createdAt: "2025-01-12T16:43:32.549Z",
  updatedAt: "2025-01-12T16:43:32.549Z",
  isSuccess: null,
  branch: {
    id: "2c16eb9e-677c-4c12-9318-4cbd363b84ef",
    name: "hotfix/1",
  },
};

type Deployment = typeof deploymenExample;

const state = proxy<{
  deployments: Deployment[];
}>({
  deployments: [],
});

export default function Page() {
  const { project: projectId } = useParams();
  const loadDeployments = useCallback(async () => {
    if (!projectId) return;
    const { data } = await AppV2.api.v2.projects.deployments["find-many"]({
      projectId: projectId as string,
    }).get();
    if (data) {
      state.deployments = data.data as any;
    }
  }, [projectId]);
  useShallowEffect(() => {
    loadDeployments();
  }, [projectId, loadDeployments]);
  return (
    <Stack>
      <Seksion1 />
      <Divider />
      <Seksion2 />
    </Stack>
  );
}

function Seksion1() {
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
    >
      <Stack>
        <Title order={2}>Deployments</Title>
        <Flex gap={"md"} align={"center"}>
          <Text>
            <FaGithub size={14} />
          </Text>
          <Text>bipproduction/project-name</Text>
        </Flex>
      </Stack>
    </Container>
  );
}

function Seksion2() {
  const { project: projectId } = useParams();
  const { deployments } = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleDeploy(commitId: string) {
    try {
      setLoading(true);
      AppV2.api.v2.projects.deploy
        .deploy({
          commitId,
        })
        .post();
      router.push(`/overview/${projectId}/${commitId}`);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
    >
      <Stack>
        <Flex gap={"md"} align={"center"}>
          <TextInput
            w={"100%"}
            leftSection={<FaSearch size={14} />}
            placeholder="Search"
          />

          <DatePickerInput
            w={"100%"}
            leftSection={<FaCalendarAlt size={14} />}
            type="range"
          />
          <Select
            w={"100%"}
            data={["production", "preview"]}
            placeholder="environment"
          />
        </Flex>
        {!deployments.length && (
          <Stack>
            <Flex justify={"center"} align={"center"} h={"100%"}>
              <Text>loading...</Text>
            </Flex>
          </Stack>
        )}
        <Table withTableBorder>
          <Table.Tbody>
            {deployments.map((deployment) => (
              <Table.Tr key={deployment.id}>
                <Table.Td p={"md"}>
                  <Stack gap={0}>
                    <UnstyledButton
                      display={deployment.isSuccess ? "block" : "none"}
                      component={Link}
                      href={`/overview/${projectId}/${deployment.id}`}
                    >
                      <Text fw={"bold"} c={"blue"}>
                        {deployment.sha}
                      </Text>
                    </UnstyledButton>
                    <Text
                      display={deployment.isSuccess ? "none" : "block"}
                      fw={"bold"}
                      c={"white"}
                    >
                      {deployment.sha}
                    </Text>
                    <Text>{deployment.message}</Text>
                    <Flex gap={"xs"} align={"center"}>
                      <Box>
                        <FaUser size={14} />
                      </Box>
                      <Text size={"xs"}>{deployment.author}</Text>
                      <Box>
                        <FaCalendarAlt size={14} />
                      </Box>
                      <Text size={"xs"}>
                        {moment(deployment.date).format("DD MMMM YYYY HH:mm")}
                      </Text>
                    </Flex>
                  </Stack>
                </Table.Td>
                <Table.Td p={"md"}>
                  <Flex align={"center"} gap={"xs"}>
                    <Box>
                      <FaCodeBranch size={14} />
                    </Box>
                    <Text>{deployment.branch.name}</Text>
                  </Flex>
                </Table.Td>
                <Table.Td p={"md"}>
                  <Flex align={"center"} gap={"xs"}>
                    <Badge
                      color={deployment.isSuccess ? "green" : "red"}
                      variant="light"
                    >
                      {deployment.isSuccess ? "success" : "failed"}
                    </Badge>
                    <CustomButtonFun
                      loading={loading}
                      leftSection={<FaPlay size={14} />}
                      display={deployment.isSuccess ? "none" : "block"}
                      onClick={() => {
                        handleDeploy(deployment.id);
                      }}
                    >
                      Deploy
                    </CustomButtonFun>
                  </Flex>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
}


