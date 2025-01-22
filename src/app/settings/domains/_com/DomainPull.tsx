import { useSnapshot } from "valtio";

import { stateDomains } from "../_state/stste_domains";

import {
  ActionIcon,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { FaTimes } from "react-icons/fa";

function DomainPull() {
  const { loading } = useSnapshot(stateDomains);
  return (
    <Container
      w={{
        base: "90%",
        md: "60%",
      }}
      fluid
    >
      <Card>
        <Stack>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => (stateDomains.isPull = false)}
          >
            <FaTimes />
          </ActionIcon>
          <Stack>
            <Text>Are you sure you want to pull this domain?</Text>
            <Group justify="end">
              <Button.Group>
                <Button
                  loading={loading}
                  onClick={() => stateDomains.pull()}
                  variant="light"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => (stateDomains.isPull = false)}
                  variant="light"
                >
                  No
                </Button>
              </Button.Group>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}

export default DomainPull;
