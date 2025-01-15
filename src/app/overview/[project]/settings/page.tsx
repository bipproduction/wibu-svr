"use client";

import CustomButtonFun from "@/components/CustomButtonFun";
import {
  Card,
  Flex,
  Stack,
  Switch,
  Text,
  TextInput,
  Title
} from "@mantine/core";

export default function Page() {
  return (
    <Stack gap={"xl"}>
      <ProjectName />
      <BuildAndDevelopmentSettings />
    </Stack>
  );
}

function ProjectName() {
  return (
    <Card withBorder>
      <Stack gap={"xl"}>
        <Stack gap={0}>
          <Title order={3}>Project Name</Title>
          <Text>
            The name of the project. This is used to identify the project in the
            system.
          </Text>
        </Stack>
        <Flex w={"100%"} gap={"md"} align={"center"} justify={"space-between"}>
          <TextInput placeholder="Project Name" w={"100%"} />
          <CustomButtonFun>Save</CustomButtonFun>
        </Flex>
      </Stack>
    </Card>
  );
}

function BuildAndDevelopmentSettings() {
  return (
    <Card withBorder>
      <Stack>
        <Title order={3}>Build and Development</Title>
        <Text>
          The build and development settings for the project. This is used to
          build and develop the project.
        </Text>
        <Flex w={"100%"} gap={"md"} align={"end"} justify={"space-between"}>
          <TextInput
            label="Build Command"
            placeholder="Build Command"
            w={"100%"}
          />
          <Switch w={200} label="Override" labelPosition="left" />
        </Flex>
        <Flex w={"100%"} gap={"md"} align={"end"} justify={"space-between"}>
          <TextInput
            label="Install Command"
            placeholder="Install Command"
            w={"100%"}
          />
          <Switch w={200} label="Override" labelPosition="left" />
        </Flex>
      </Stack>
    </Card>
  );
}
