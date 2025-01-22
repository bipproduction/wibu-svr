/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSnapshot } from "valtio";

import {
  ActionIcon,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { FaSearch, FaTimes } from "react-icons/fa";
import overviewState from "../_state/state_overview";
import ProjectCard from "./ProjectCard";

function ProjectsViews() {
  const snapshot = useSnapshot(overviewState);

  useShallowEffect(() => {
    overviewState.loadProjects();
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
                  overviewState.search = "";
                  overviewState.projects = [...overviewState.projects];
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
            overviewState.search = e.target.value;
            overviewState.projects = overviewState.projects.filter(
              (project: any) => project.name.includes(overviewState.search)
            );
          }}
        />
        <Button
          bg={"white"}
          c={"black"}
          onClick={() => (overviewState.isCreateOpen = true)}
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

export default ProjectsViews;
