import AppV2 from "@/lib/api/v2/util/app-v2";
import { Button, Flex, Stack, TextInput, Title } from "@mantine/core";
import { useState } from "react";

export function PortGenerator({
  value,
  onChange,
}: {
  value: number[] | undefined;
  onChange: (ports: number[]) => void;
}) {
  const [count, setCount] = useState(value?.length ?? 1);
  const [ports, setPorts] = useState<number[]>(value ?? []);
  const [loadingPorts, setLoadingPorts] = useState(false);

  async function loadPorts() {
    try {
      setLoadingPorts(true);
      const { data } = await AppV2.api.v2.utils["port-find-available"]({
        count: count,
      }).get();
      setPorts(data ?? []);
      onChange(data ?? []);
    } finally {
      setLoadingPorts(false);
    }
  }
  return (
    <Stack>
      <Title order={3}>Ports</Title>
      <Flex gap={"sm"}>
        <TextInput
          placeholder="Count"
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />
        <Button
          loading={loadingPorts}
          onClick={() => loadPorts()}
          variant="light"
        >
          Generate
        </Button>
      </Flex>
      <TextInput
        placeholder="Ports"
        value={ports.join(",")}
        onChange={(event) =>
          onChange(event.target.value.split(",").map(Number))
        }
      />
    </Stack>
  );
}
