import {
  Card,
  Stack,
  Flex,
  ActionIcon,
  Button,
  Loader,
  Text,
} from "@mantine/core";
import { ServerConfig } from "@prisma/client";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { stateDomains } from "../_state/stste_domains";

function DomainContent({ value }: { value: ServerConfig }) {
  const [isRemove, setIsRemove] = useState(false);
  if (!value) return <Loader />;
  if (isRemove) return <RemoveDomainConfig id={value.id} />;

  return (
    <Card key={value.id}>
      <Stack>
        <Flex justify="end">
          <ActionIcon.Group>
            <ActionIcon
              variant="light"
              onClick={() => (stateDomains.update.data = value)}
            >
              <FaEdit />
            </ActionIcon>
            <ActionIcon variant="light" onClick={() => setIsRemove(true)}>
              <FaTrash />
            </ActionIcon>
          </ActionIcon.Group>
        </Flex>
        <Text>{value.name}</Text>
        <Text>{value.ports?.join(",")}</Text>
      </Stack>
    </Card>
  );

  function RemoveDomainConfig({ id }: { id: string }) {
    return (
      <Card>
        <Stack>
          <Text>Are you sure you want to remove this domain?</Text>
          <Button.Group>
            <Button onClick={() => stateDomains.remove(id)} variant="light">
              Yes
            </Button>
            <Button onClick={() => setIsRemove(false)} variant="light">
              No
            </Button>
          </Button.Group>
        </Stack>
      </Card>
    );
  }
}

export default DomainContent;
