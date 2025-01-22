"use client";
import { Card, Stack, Flex, Box, Menu, ActionIcon, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { FaHome, FaEllipsisV, FaGithub, FaCodeBranch } from "react-icons/fa";
import { ProjectApiModel } from "../_ast/project-example";

function ProjectCard({ project }: { project: ProjectApiModel }) {
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

export default ProjectCard;
