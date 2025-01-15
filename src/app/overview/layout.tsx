import { Box, Container, Divider, Stack, Text } from "@mantine/core";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack pos={"relative"}>
      <Box
        style={{
          overflow: "auto",
        }}
        h={"100vh"}
      >
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
