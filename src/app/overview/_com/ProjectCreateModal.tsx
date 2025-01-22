import { useSnapshot } from "valtio";

import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Editor } from "@monaco-editor/react";
import { FaGithub, FaHome, FaTimes } from "react-icons/fa";
import deployProjectState from "../_state/state_deploy";
import overviewState from "../_state/state_overview";

function ProjectCreateModal() {
  const snapshot = useSnapshot(deployProjectState);

  return (
    <Container>
      <Card>
        <Stack>
          <Flex justify={"space-between"}>
            <ActionIcon
              variant="transparent"
              onClick={() => (overviewState.isCreateOpen = false)}
            >
              <FaTimes />
            </ActionIcon>
          </Flex>
          <Stack>
            <Title order={3}> New Project </Title>
            <TextInput
              leftSection={<FaGithub />}
              placeholder="Github Repository"
              value={snapshot.form.githubRepo}
              onChange={(e) => (deployProjectState.form.githubRepo = e.target.value)}
              error={
                snapshot.form.githubRepo.length > 0 &&
                !snapshot.form.githubRepo.includes("github.com")
                  ? "Invalid Github Repository"
                  : undefined
              }
            />
            <TextInput
              leftSection={<FaHome />}
              placeholder="Project Name"
              value={snapshot.form.projectName}
              onChange={(e) =>
                (deployProjectState.form.projectName = e.target.value)
              }
              error={
                snapshot.form.projectName.length > 0 &&
                snapshot.form.projectName.match(/^[a-zA-Z0-9_-]+$/) === null
                  ? "Invalid Project Name"
                  : undefined
              }
            />
            <Text> Environment Variables </Text>
            <Editor
              theme="vs-dark"
              height={"200px"}
              language="yaml"
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              value={snapshot.form.envVariables}
              onChange={(value) =>
                (deployProjectState.form.envVariables = value ?? "")
              }
            />
            <Group justify={"flex-end"}>
              <Button loading={snapshot.loading} onClick={() => deployProjectState.handleDeploy()}>Deploy</Button>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}

export default ProjectCreateModal;
