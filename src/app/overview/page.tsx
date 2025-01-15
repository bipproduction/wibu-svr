/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppV2 from "@/utils/app-v2";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useHover, useShallowEffect } from "@mantine/hooks";
import { Editor } from "@monaco-editor/react";
import dedent from "dedent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaCodeBranch,
  FaEllipsisV,
  FaGithub,
  FaHome,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { proxy, useSnapshot } from "valtio";

const projectsExample = {
  id: "11238988-1ca4-4527-93d0-ef0bb5c32ef9",
  name: "wibu-storage",
  repository: "https://github.com/bipproduction/wibu-storage.git",
  createdAt: "2025-01-10T22:00:32.593Z",
  updatedAt: "2025-01-10T22:00:32.593Z",
  active: true,
  ProjectCommit: [
    {
      commit: {
        id: "3b02c5d6-6e67-4b25-b933-4c2adce6b164",
        sha: "9e46d9019fd6060331fa33f392314f126c7f56a6",
        author: "bipproduction",
        email: "bip.production.js@gmail.com",
        date: "2024-12-10T20:32:14.000Z",
        message: "tambahan baru",
        branch: "main",
        url: "https://github.com/bipproduction/wibu-storage/commit/9e46d9019fd6060331fa33f392314f126c7f56a6",
        projectId: "11238988-1ca4-4527-93d0-ef0bb5c32ef9",
        createdAt: "2025-01-10T22:17:55.414Z",
        updatedAt: "2025-01-10T22:17:55.414Z",
      },
    },
  ],
};

type Project = typeof projectsExample;
const state = proxy<{
  search: string;
  isCreateOpen: boolean;
  projects: Project[];
}>({
  search: "",
  isCreateOpen: false,
  projects: [],
});

export default function Page() {
  const snapshot = useSnapshot(state);
  if (snapshot.isCreateOpen) {
    return <CreateProjectModal />;
  }
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
    >
      <Projects />
    </Container>
  );
}

function Projects() {
  const snapshot = useSnapshot(state);

  async function loadProjects() {
    const { data } = await AppV2.api.v2.projects["find-many"].get();
    console.log(JSON.stringify(data?.data, null, 2));
    if (data?.status !== 200) {
      alert(data?.message);
      return;
    }
    state.projects = data.data as any;
  }

  useShallowEffect(() => {
    loadProjects();
  }, []);

  return (
    <Stack p={"md"}>
      <Text>Projects</Text>
      <Flex gap={"md"}>
        <TextInput
          leftSection={<FaSearch />}
          rightSection={
            snapshot.search.length > 0 && (
              <ActionIcon
                onClick={() => {
                  state.search = "";
                  state.projects = [...state.projects];
                }}
              >
                <FaTimes />
              </ActionIcon>
            )
          }
          w={"100%"}
          placeholder="Search"
          value={snapshot.search}
          onChange={(e) => {
            state.search = e.target.value;
            state.projects = state.projects.filter((project: any) =>
              project.name.includes(state.search)
            );
          }}
        />
        <Button
          bg={"white"}
          c={"black"}
          onClick={() => (state.isCreateOpen = true)}
        >
          Create
        </Button>
      </Flex>
      <SimpleGrid
        cols={{
          base: 1,
          sm: 2,
          md: 2,
          lg: 3,
        }}
      >
        {snapshot.projects.map((project: any) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { hovered, ref } = useHover();
  const router = useRouter();
  return (
    <Card
      pos={"relative"}
      ref={ref}
      key={project.name}
      withBorder
      style={{
        cursor: "pointer",
        border: hovered ? "1px solid #777" : "1px solid #444",
      }}
      onClick={() => router.push(`/overview/${project.id}`)}
    >
      <Stack gap={"xs"}>
        <Flex align={"center"} gap={"md"} justify={"space-between"}>
          <Flex align={"center"} gap={"md"} w={"100%"}>
            <FaHome color="white" size={24} />
            <Stack gap={0}>
              <Text c={"white"} fw={"bold"}>
                {project.name}
              </Text>
              {/* <Text c={"gray.6"}>{project.}</Text> */}
            </Stack>
          </Flex>
          <Box onClick={(e) => e.stopPropagation()}>
            <Menu>
              <Menu.Target>
                <ActionIcon c={"white"} variant="transparent" radius={"xl"}>
                  <FaEllipsisV />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Text>View Logs</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Manage Domains</Text>
                </Menu.Item>
                <Menu.Item>
                  <Text>Settings</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </Flex>
        <Flex
          w={"fit-content"}
          bg={"gray.9"}
          px={"md"}
          py={"4"}
          align={"center"}
          gap={"md"}
          style={{
            borderRadius: "100px",
          }}
        >
          <FaGithub color="white" size={24} />
          <Text fz={"xs"} fw={"bold"} c={"white"}>
            {project.repository}
          </Text>
        </Flex>
        {project.ProjectCommit && project.ProjectCommit[0] && (
          <Stack gap={0} c={"gray.6"}>
            <Text fz={"xs"} c={"gray.6"}>
              {project.ProjectCommit[0].commit.message}
            </Text>
            <Flex gap={"xs"}>
              <Text>
                {new Date(
                  project.ProjectCommit[0].commit.date
                ).toLocaleDateString()}
              </Text>
              <Flex align={"center"} gap={"xs"}>
                <Text>on</Text>
                <FaCodeBranch />
                <Text>{project.ProjectCommit[0].commit.branch}</Text>
              </Flex>
            </Flex>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

const createProjectState = proxy({
  githubRepo: "",
  projectName: "",
  envVariables: dedent`
    # Environment Variables

    # Add your environment variables here

    # Example:
    # MY_VARIABLE=value
  `,
  isError: false,
  errorMessage: "",
});

function CreateProjectModal() {
  const snapshot = useSnapshot(createProjectState);
  const [loading, setLoading] = useState(false);

  async function handleDeploy() {
    if (
      snapshot.githubRepo.length === 0 ||
      snapshot.projectName.length === 0 ||
      snapshot.envVariables.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    if (snapshot.isError) {
      alert(snapshot.errorMessage);
      return;
    }

    try {
      setLoading(true);
      const { status, data } = await AppV2.api.v2.projects.create.post({
        name: snapshot.projectName,
        repository: snapshot.githubRepo,
        envVariables: snapshot.envVariables,
      });

      if (status !== 200 || data?.status !== 200) {
        alert(data?.message);
        return;
      }
      alert("Project created and deployed successfully");
      state.isCreateOpen = false;
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container>
      <Card>
        <Stack>
          <Flex justify={"space-between"}>
            <ActionIcon
              variant="transparent"
              onClick={() => (state.isCreateOpen = false)}
            >
              <FaTimes />
            </ActionIcon>
          </Flex>
          <Stack>
            <Title order={3}>New Project</Title>
            <TextInput
              leftSection={<FaGithub />}
              placeholder="Github Repository"
              value={snapshot.githubRepo}
              onChange={(e) => (createProjectState.githubRepo = e.target.value)}
              error={
                snapshot.githubRepo.length > 0 &&
                !snapshot.githubRepo.includes("github.com")
                  ? "Invalid Github Repository"
                  : undefined
              }
              onError={() => {
                createProjectState.isError = true;
                createProjectState.errorMessage = "Invalid Github Repository";
              }}
            />
            <TextInput
              leftSection={<FaHome />}
              placeholder="Project Name"
              value={snapshot.projectName}
              onChange={(e) =>
                (createProjectState.projectName = e.target.value)
              }
              error={
                snapshot.projectName.length > 0 &&
                snapshot.projectName.match(/^[a-zA-Z0-9_-]+$/) === null
                  ? "Invalid Project Name"
                  : undefined
              }
              onError={() => {
                createProjectState.isError = true;
                createProjectState.errorMessage = "Invalid Project Name";
              }}
            />
            <Text>Environment Variables</Text>
            <Editor
              theme="vs-dark"
              height={"200px"}
              language="yaml"
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              value={snapshot.envVariables}
              onChange={(value) =>
                (createProjectState.envVariables = value ?? "")
              }
            />
            <Group justify={"flex-end"}>
              <Button loading={loading} onClick={handleDeploy}>
                Deploy
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
