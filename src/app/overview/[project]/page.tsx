/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomButton from "@/components/CustomButton";
import CustomButtonFun from "@/components/CustomButtonFun";
import AppV2 from "@/lib/api/v2/util/app-v2";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaCalendar,
  FaCheckCircle,
  FaCircle,
  FaCode,
  FaCodeBranch,
  FaConnectdevelop,
  FaEye,
  FaGithub,
  FaSearch,
  FaSync,
  FaUndo,
  FaUser,
} from "react-icons/fa";
import { proxy, useSnapshot } from "valtio";

const commitExample = {
  id: "fa3ee1c8-6a9d-4b2e-b1c2-602fb69ecf23",
  sha: "9e46d9019fd6060331fa33f392314f126c7f56a6",
  author: "bipproduction",
  email: "bip.production.js@gmail.com",
  date: "2024-12-10T20:32:14.000Z",
  message: "tambahan baru",
  url: "https://github.com/bipproduction/wibu-storage/commit/9e46d9019fd6060331fa33f392314f126c7f56a6",
  projectId: "f0384700-3f20-4ecf-951b-278f0e8f810a",
  branch: "main",
  hasRelease: true,
  createdAt: "2025-01-10T23:12:45.763Z",
  updatedAt: "2025-01-10T23:12:45.763Z",
};

const branchExample = {
  id: "e67d9f1f-5449-4ab3-9eea-1f7233476372",
  name: "hotfix/1",
  sha: "5e2832826dd1604ea5919eecabd0ad6590ac22e6",
  hasRelease: false,
  promote: [
    {
      envGroup: {
        id: "production",
        name: "production",
      },
      commit: {
        id: "9e46d9019fd6060331fa33f392314f126c7f56a6",
        sha: "9e46d9019fd6060331fa33f392314f126c7f56a6",
        message: "tambahan baru",
        author: "bipproduction",
        date: "2024-12-10T20:32:14.000Z",
      },
      hasPromote: false,
    },
    {
      envGroup: {
        id: "preview",
        name: "preview",
      },
      commit: {
        id: "9e46d9019fd6060331fa33f392314f126c7f56a6",
        sha: "9e46d9019fd6060331fa33f392314f126c7f56a6",
        message: "tambahan baru",
        author: "bipproduction",
        date: "2024-12-10T20:32:14.000Z",
      },
      hasPromote: false,
    },
  ],
};

type Branch = typeof branchExample;
type Commit = typeof commitExample;

const state = proxy<{
  projectData: any | null;
  commits: Commit[] | null;
  branches: Branch[] | null;
  branchOnly: { id: string; name: string; projectId: string }[] | null;
}>({
  projectData: null,
  commits: null,
  branches: null,
  branchOnly: null,
});

export default function Page() {
  const { project } = useParams();

  async function loadProject() {
    if (!project) return;
    const { data } = await AppV2.api.v2.projects["find-unique"]({
      id: project as string,
    }).get();
    if (data?.status !== 200) {
      alert("Failed to load project data");
      return;
    }
    state.projectData = data.data as any;
  }

  async function loadCommits() {
    const { data } = await AppV2.api.v2.projects.commits["commit-find-many"]({
      projectId: project as string,
    }).get();
    if (data?.status !== 200) {
      alert("Failed to load commits");
      return;
    }
    state.commits = data.data as any;
  }

  useShallowEffect(() => {
    loadProject();
  }, [project]);

  useShallowEffect(() => {
    loadCommits();
  }, [project]);

  return (
    <Stack gap={"lg"}>
      <Seksion1 />
      <Divider />
      <Seksion2 />
      <Seksion3 />
      <ActiveBranch />
      <CommitAndReleases />
    </Stack>
  );
}

function Seksion1() {
  const snapshot = useSnapshot(state);

  if (!snapshot.projectData) return <Skeleton h={100} />;
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
      py={"md"}
    >
      <Stack align="start" justify="start">
        <Flex w={"100%"} justify="space-between" gap={"md"}>
          <Stack gap={0}>
            <Title order={2}>{snapshot.projectData?.name}</Title>
            <Text>{snapshot.projectData.id}</Text>
          </Stack>
          <Flex gap={"xs"}>
            <CustomButton
              href={snapshot.projectData?.repository}
              leftSection={<FaGithub size={24} />}
            >
              Repository
            </CustomButton>
            <CustomButton
              href={`/overview/${snapshot.projectData?.id}/domains`}
            >
              Domains
            </CustomButton>
          </Flex>
        </Flex>
      </Stack>
    </Container>
  );
}

function Seksion2() {
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
      py={"md"}
    >
      <Stack>
        <Flex gap={"xl"}>
          <Stack w={"100%"} gap={0}>
            <Title order={2}>Production Deployment</Title>
            <Text>This is the production deployment of your project.</Text>
          </Stack>
          <Flex gap={"xs"}>
            <CustomButton href={``}>Build Logs</CustomButton>
            <CustomButton href={``}>Runtime Logs</CustomButton>
            <CustomButton href={``} leftSection={<FaUndo size={16} />}>
              Instant Rollback
            </CustomButton>
          </Flex>
        </Flex>
      </Stack>
    </Container>
  );
}

function Seksion3() {
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      py={"md"}
      fluid
    >
      <Card withBorder>
        <Grid>
          <Grid.Col span={4}>
            <Title order={3}>Domains</Title>
            <Text>This is the domains of your project.</Text>
            <Skeleton h={250} />
          </Grid.Col>
          <Grid.Col span={8}>
            <Stack>
              <Stack gap={0}>
                <Text c={"gray.5"}>Deployments</Text>
                <Text c={"white"}>
                  This is the deployments of your project.
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text c={"gray.5"}>Domains</Text>
                <Text c={"white"}>project.com</Text>
              </Stack>
              <Stack gap={0}>
                <Text c={"gray.5"}>Status</Text>
                <Flex align={"center"} justify={"start"} gap={"xs"}>
                  <Box c={"green"}>
                    <FaCircle size={14} />
                  </Box>
                  <Text c={"white"}>Ready</Text>
                </Flex>
              </Stack>
              <Stack gap={0}>
                <Text c={"gray.5"}>Source</Text>
                <Flex align={"center"} justify={"start"} gap={"xs"}>
                  <Box c={"blue"}>
                    <FaCodeBranch size={14} />
                  </Box>
                  <Text c={"white"}>Main</Text>
                </Flex>
                <Flex align={"center"} justify={"start"} gap={"xs"}>
                  <Box c={"blue"}>
                    <FaConnectdevelop size={14} />
                  </Box>
                  <Text c={"white"}>Message Merge</Text>
                </Flex>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}

function ActiveBranch() {
  const snapshot = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function loadBranches() {
    if (!snapshot.projectData) return;
    const { data, status } = await AppV2.api.v2.projects.branches[
      "branch-find-many"
    ]({
      projectId: snapshot.projectData?.id as string,
    }).get();
    if (status !== 200) {
      alert("Failed to load branches");
      return;
    }
    state.branches = data?.data as any;
  }

  async function deployCommit(commitId: string) {
    try {
      setLoading(true);
      AppV2.api.v2.projects.deploy
        .deploy({
          commitId: commitId,
        })
        .post();

      router.push(`/overview/${snapshot.projectData?.id}/${commitId}`);
    } catch (error) {
      alert("Failed to deploy");
    } finally {
      setLoading(false);
    }
  }

  useShallowEffect(() => {
    loadBranches();
  }, [snapshot.projectData]);

  async function syncBranches() {
    console.log(snapshot.projectData);
    try {
      setLoading(true);
      if (!snapshot.projectData) return;
      const { data, status } = await AppV2.api.v2.projects.branches[
        "branch-sync-all"
      ]({
        projectId: snapshot.projectData?.id as string,
      }).patch();
      if (status !== 200) {
        alert("Failed to sync branches");
        return;
      }
      loadBranches();
    } catch (error) {
      alert("Failed to sync branches");
    } finally {
      setLoading(false);
    }
  }

  if (!snapshot.branches) return <Skeleton h={100} />;

  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
      py={"md"}
    >
      <Stack gap={"md"}>
        <Flex justify={"space-between"}>
          <Title order={2}>Active Branches</Title>
          <CustomButtonFun loading={loading} onClick={syncBranches}>
            Sync
          </CustomButtonFun>
        </Flex>
        <Text>This is the active branches of your project.</Text>
        <TextInput
          leftSection={<FaSearch size={16} />}
          placeholder="Search branches"
        />
        <ScrollArea h={"500px"}>
          <Stack>
            {snapshot.branches.map((branch, index) => (
              <Card key={index}>
                <Flex
                  align={"center"}
                  justify={"space-between"}
                  gap={"xs"}
                  p={"md"}
                  w={"100%"}
                >
                  <Stack gap={0}>
                    <Flex align={"center"} justify={"space-between"} gap={"xs"}>
                      <Flex gap={"md"} align={"center"}>
                        <Box c={"blue"}>
                          <FaCodeBranch size={16} />
                        </Box>
                        <Text c={"white"} fw={"bold"}>
                          {branch.name}
                        </Text>
                      </Flex>
                    </Flex>
                    <Text c={"gray.5"} fz={"sm"}>
                      {branch.sha}
                    </Text>
                    <Flex align={"center"} justify={"start"} gap={"xs"}>
                      <Box c={branch.hasRelease ? "green" : "gray.5"}>
                        <FaCheckCircle size={14} />
                      </Box>
                      <Text c={"gray.5"} fz={"sm"}>
                        {branch.hasRelease ? "Release" : "No Release"}
                      </Text>
                    </Flex>
                    <Flex align={"center"} justify={"start"} gap={"xs"}>
                      {branch.promote.map((promote, index2) => (
                        <Stack key={index2} gap={0}>
                          <Flex
                            align={"center"}
                            justify={"start"}
                            gap={"xs"}
                            key={index2}
                          >
                            <Box c={promote.hasPromote ? "green" : "gray.5"}>
                              <FaCodeBranch size={14} />
                            </Box>
                            <Text c={"gray.5"} fz={"sm"}>
                              {promote.envGroup.name}
                            </Text>
                          </Flex>
                        </Stack>
                      ))}
                    </Flex>
                  </Stack>
                  <CustomButtonFun
                    display={branch.hasRelease ? "inline-block" : "none"}
                    loading={loading}
                    leftSection={
                      <Box c={"blue"}>
                        <FaEye size={14} />
                      </Box>
                    }
                    onClick={() =>
                      router.push(
                        `/overview/${snapshot.projectData?.id}/${branch.sha}`
                      )
                    }
                  >
                    Detail
                  </CustomButtonFun>
                  <CustomButtonFun
                    display={branch.hasRelease ? "none" : "inline-block"}
                    loading={loading}
                    leftSection={<FaCode size={14} />}
                    onClick={() => deployCommit(branch.sha)}
                  >
                    Deploy
                  </CustomButtonFun>
                </Flex>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Container>
  );
}

function CommitAndReleases() {
  const snapshot = useSnapshot(state);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  async function loadCommits() {
    if (!snapshot.projectData) return;
    const { data, status } = await AppV2.api.v2.projects.branches[
      "branch-only-find-many"
    ]({
      projectId: snapshot.projectData?.id as string,
    }).get();
    if (status !== 200) {
      alert("Failed to load commits");
      return;
    }
    state.branchOnly = data?.data as any;
    setSelectedBranch(data?.data?.[0]?.id || null);
  }

  useShallowEffect(() => {
    loadCommits();
  }, [snapshot.projectData]);

  if (!snapshot.branchOnly) return <Skeleton h={100} />;
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
      py={"md"}
    >
      <Stack>
        <Title order={2}>Commit And Releases</Title>
        <Text>This is the commit and releases of your project.</Text>
        <Button.Group>
          {snapshot.branchOnly.map((branch, index) => (
            <Button
              color={selectedBranch === branch.id ? "blue" : "gray"}
              onClick={() => setSelectedBranch(branch.id)}
              variant="subtle"
              key={index}
            >
              {branch.name}
            </Button>
          ))}
        </Button.Group>
        <Divider />
        <CommitAndReleasesContent selectedBranch={selectedBranch} />
      </Stack>
    </Container>
  );
}

function CommitAndReleasesContent({
  selectedBranch,
}: {
  selectedBranch: string | null;
}) {
  const snapshot = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const router = useRouter();

  useShallowEffect(() => {
    loadCommits();
  }, [selectedBranch]);

  async function loadCommits() {
    try {
      setLoading(true);
      if (!snapshot.projectData || !selectedBranch) return;
      const { data, status } = await AppV2.api.v2.projects.commits[
        "commit-by-branch-find-many"
      ]({
        projectId: snapshot.projectData?.id as string,
      })({
        branchId: selectedBranch as string,
      }).get();
      if (status !== 200) {
        alert("Failed to load commits");
        return;
      }
      setCommits(data?.data as any);
    } catch (error) {
      alert("Failed to load commits");
    } finally {
      setLoading(false);
    }
  }

  async function syncCommits() {
    try {
      setLoading(true);
      if (!snapshot.projectData) return;
      const { data, status } = await AppV2.api.v2.projects.commits[
        "commit-sync-by-branch"
      ]({
        projectId: snapshot.projectData?.id as string,
      })({
        branchId: selectedBranch as string,
      }).patch();
      if (status !== 200) {
        alert("Failed to sync commits");
        return;
      }
      loadCommits();
    } catch (error) {
      alert("Failed to sync commits");
    } finally {
      setLoading(false);
    }
  }

  async function deployCommit(commitId: string) {
    try {
      setLoading(true);
      AppV2.api.v2.projects.deploy
        .deploy({
          commitId: commitId,
        })
        .post();
      router.push(`/overview/${snapshot.projectData?.id}/${commitId}`);
    } catch (error) {
      alert("Failed to deploy");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack>
      <Group justify={"start"}>
        <CustomButtonFun
          loading={loading}
          leftSection={<FaSync size={16} />}
          onClick={syncCommits}
        >
          Sync
        </CustomButtonFun>
      </Group>
      <ScrollArea h={"500px"}>
        {loading && <Text>Loading...</Text>}
        <Stack>
          {commits?.map((commit, index) => (
            <Card key={index}>
              <Stack gap={0}>
                <Flex align={"center"} justify={"space-between"} gap={"xs"}>
                  <Flex align={"center"} justify={"start"} gap={"xs"}>
                    <Box c={commit.hasRelease ? "green" : "gray.5"}>
                      <FaCheckCircle size={14} />
                    </Box>
                    <Text c={"white"} fw={"bold"}>
                      {commit.sha}
                    </Text>
                  </Flex>
                  <CustomButton
                    display={commit.hasRelease ? "inline-block" : "none"}
                    leftSection={
                      <Box c={"blue"}>
                        <FaEye size={14} />
                      </Box>
                    }
                    href={`/overview/${snapshot.projectData?.id}/${commit.id}`}
                  >
                    Detail
                  </CustomButton>
                  <CustomButtonFun
                    display={commit.hasRelease ? "none" : "inline-block"}
                    loading={loading}
                    leftSection={<FaCode size={14} />}
                    onClick={async () => {
                      await deployCommit(commit.id);
                    }}
                  >
                    Deploy
                  </CustomButtonFun>
                </Flex>
                <Text c={"gray.6"} fz={"sm"} lineClamp={2}>
                  {commit.message}
                </Text>
                <Flex gap={"xs"}>
                  <Flex align={"center"} justify={"start"} gap={"xs"}>
                    <Box c={"gray.5"}>
                      <FaUser size={14} />
                    </Box>
                    <Text>{commit.author}</Text>
                  </Flex>
                  <Flex align={"center"} justify={"start"} gap={"xs"}>
                    <Box c={"gray.5"}>
                      <FaCalendar size={14} />
                    </Box>
                    <Text>
                      {moment(commit.date).format("DD MMMM YYYY HH:mm")}
                    </Text>
                  </Flex>
                </Flex>
              </Stack>
            </Card>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
