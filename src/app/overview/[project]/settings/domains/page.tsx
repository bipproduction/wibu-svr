"use client";

import { Stack, Text, Title } from "@mantine/core";

export default function Page() {
  return (
    <Stack>
      <Title order={3}>Domains</Title>
      <Text>
        Add domains to your project. You can add multiple domains and subdomains
        to your project.
      </Text>
    </Stack>
  );
}
