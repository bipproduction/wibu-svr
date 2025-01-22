import { useSnapshot } from "valtio";
import { stateDomains } from "../_state/stste_domains";
import {
  Container,
  Card,
  Stack,
  ActionIcon,
  TextInput,
  Group,
  Button,
} from "@mantine/core";
import { ServerConfig } from "@prisma/client";
import { FaTimes } from "react-icons/fa";
import { PortGenerator } from "./PortGenerator";

function DomainConfigUpdate() {
  const snap = useSnapshot(stateDomains);
  return (
    <Container
      w={{
        base: "90%",
        md: "60%",
      }}
    >
      <Card>
        <Stack>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => (stateDomains.update.data = null)}
          >
            <FaTimes />
          </ActionIcon>
          <TextInput
            label="Name"
            value={snap.update.data?.name}
            onChange={(event) => {
              stateDomains.update.data = {
                ...snap.update.data,
                name: event.target.value,
              } as ServerConfig;
            }}
          />
          <PortGenerator
            value={snap.update.data?.ports as number[]}
            onChange={(value) => {
              // console.log(value);
              stateDomains.update.data = {
                ...snap.update.data,
                ports: value,
              } as ServerConfig;
            }}
          />
          <Group justify="end">
            <Button
              variant="light"
              onClick={async () => {
                stateDomains.update.fun({
                  id: snap.update.data!.id,
                  name: snap.update.data!.name,
                  ports: snap.update.data!.ports as number[],
                });
              }}
            >
              Update
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}

export default DomainConfigUpdate;
