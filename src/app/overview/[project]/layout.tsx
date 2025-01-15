"use client";

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import _ from "lodash";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { FaCircleNotch } from "react-icons/fa";

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const params = useParams();

  return (
    <Stack w={"100%"}>
      <AppBar projectId={params.project as string} segment={segment} />
      <Box>{children}</Box>
    </Stack>
  );
}

const listAppBar = ["Deployments", "Logs", "Storage", "Settings"];
function AppBar({
  projectId,
  segment,
}: {
  projectId: string;
  segment: string | null;
}) {
  return (
    <Stack
      bg={"black"}
      gap={0}
      pos={"sticky"}
      top={0}
      style={{
        zIndex: 1000,
      }}
    >
      <Flex px={"md"} py={"xs"} gap={"md"} align={"center"}>
        <ActionIcon
          c={"white"}
          variant="transparent"
          size={42}
          component={Link}
          href={`/overview`}
        >
          <FaCircleNotch size={42} />
        </ActionIcon>
        <Button
          radius={0}
          styles={{
            root: {
              borderRadius: 0,
              borderBottom:
                segment === null ? "2px solid white" : "2px solid transparent",
            },
          }}
          c={segment === null ? "white" : "gray"}
          component={Link}
          href={`/overview/${projectId}`}
          variant="subtle"
          key="Project"
        >
          <Text>Project</Text>
        </Button>
        {listAppBar.map((item) => (
          <Button
            styles={{
              root: {
                borderRadius: 0,
                borderBottom:
                  segment === _.lowerCase(item)
                    ? "2px solid white"
                    : "2px solid transparent",
              },
            }}
            c={segment === _.lowerCase(item) ? "white" : "gray"}
            component={Link}
            href={`/overview/${projectId}/${_.lowerCase(item)}`}
            variant="subtle"
            key={item}
          >
            <Text>{item}</Text>
          </Button>
        ))}
      </Flex>
      <Divider />
    </Stack>
  );
}
