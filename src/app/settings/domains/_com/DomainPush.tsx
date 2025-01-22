import { useSnapshot } from "valtio";

import { stateDomains } from "../_state/stste_domains";
import { useState } from "react";
import {
  Container,
  Card,
  Stack,
  ActionIcon,
  Select,
  Group,
  Button,
  Text,
} from "@mantine/core";
import { FaTimes } from "react-icons/fa";

function DomainPush() {
  const { data } = useSnapshot(stateDomains);
  const [domainIdPush, setDomainIdPush] = useState("");
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
            onClick={() => (stateDomains.isPush = false)}
          >
            <FaTimes />
          </ActionIcon>
          <Stack>
            <Text>Are you sure you want to push this domain?</Text>
            <Select
              data={data.map((domain) => domain.name)}
              placeholder="Select Domain"
              searchable
              clearable
              value={domainIdPush}
              onChange={(value) => setDomainIdPush(value ?? "")}
            />
            <Group justify="end">
              <Button.Group>
                <Button
                  loading={stateDomains.loading}
                  onClick={() => stateDomains.push({ domainId: domainIdPush })}
                  variant="light"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => (stateDomains.isPush = false)}
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

export default DomainPush;
