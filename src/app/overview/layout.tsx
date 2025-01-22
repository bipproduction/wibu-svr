"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Stack,
  Text,
  Title
} from "@mantine/core";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack>
      <Box
        style={{
          overflow: "auto",
        }}
        h={"100vh"}
      >
        <Flex justify="space-between">
          <Title order={2}>Overview</Title>
          <Button component="a" href="/settings/domains" variant="transparent">
            <Text>Settings</Text>
          </Button>
        </Flex>
        {children}
      </Box>
      <Stack>
        <Divider />
        <Container
          w={{
            base: "100%",
            md: "80%",
          }}
          fluid
        >
          <Text>Footer</Text>
        </Container>
      </Stack>
    </Stack>
  );
}
