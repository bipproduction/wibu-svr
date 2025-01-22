import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useSnapshot } from "valtio";
import { stateFormCreate } from "../_state/state_form_create";
import { stateDomains } from "../_state/stste_domains";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

function CreateSubDomainModal() {
  const { data } = useSnapshot(stateDomains);
  const router = useRouter();
  const { domain, subDomain, ports, loadingPorts, count } =
    useSnapshot(stateFormCreate);
  return (
    <Container
      w={{
        base: "90%",
        md: "70%",
      }}
      fluid
    >
      <Card>
        <Stack>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => router.push(`/settings/domains`)}
          >
            <FaTimes />
          </ActionIcon>
          <Text>Add Sub Domain</Text>
          <Select
            label="Domain"
            data={data.map((domain) => domain.name)}
            placeholder="Select Domain"
            searchable
            clearable
            value={domain}
            onChange={(value) => (stateFormCreate.domain = value ?? "")}
          />
          <TextInput
            label="Sub Domain"
            placeholder="Sub Domain"
            value={subDomain}
            onChange={(event) =>
              (stateFormCreate.subDomain = event.target.value)
            }
          />
          <Stack>
            <Title order={3}>Ports</Title>
            <Flex gap={"sm"}>
              <TextInput
                placeholder="Count"
                value={count}
                onChange={(event) =>
                  (stateFormCreate.count = Number(event.target.value))
                }
              />
              <Button
                loading={loadingPorts}
                onClick={() => stateFormCreate.loadPorts()}
                variant="light"
              >
                Generate
              </Button>
            </Flex>
            <TextInput
              placeholder="Ports"
              value={ports.join(",")}
              onChange={(event) =>
                (stateFormCreate.ports = event.target.value
                  .split(",")
                  .map(Number))
              }
            />
          </Stack>
          <Group justify="end">
            <Button
              onClick={() => stateFormCreate.create()}
              variant="light"
              loading={loadingPorts}
            >
              Add
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}

export default CreateSubDomainModal;
