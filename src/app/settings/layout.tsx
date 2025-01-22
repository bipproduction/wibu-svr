"use client";

import { Button, Flex, Stack, Tabs, Text, Title } from "@mantine/core";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

const tabs = [
  { label: "Domains", value: "domains" },
  { label: "Users", value: "users" },
  { label: "Billing", value: "billing" },
  { label: "Notifications", value: "notifications" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegment();
  const router = useRouter();
  return (
    <Stack suppressHydrationWarning>
      <Flex justify="space-between">
        <Title order={2}>Settings</Title>
        <Button component="a" href="/overview" variant="transparent">
          <Text>Overview</Text>
        </Button>
      </Flex>
      <Tabs defaultValue={segments}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              onClick={() => {
                router.push(`/settings/${tab.value}`);
              }}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {children}
      </Tabs>
    </Stack>
  );
}
