"use client";

import { Container, Divider, Flex, NavLink, Stack, Title } from "@mantine/core";
import _ from "lodash";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { useRouter } from "next/navigation";
const listSettings = [
  {
    title: "Domains",
    link: "/overview/[project]/settings/domains",
  },
  {
    title: "Environments",
    link: "/overview/[project]/settings/environments",
  },
  {
    title: "Git",
    link: "/overview/[project]/settings/git",
  },
  {
    title: "Cron Jobs",
    link: "/overview/[project]/settings/cron-jobs",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const { project } = useParams();
  return (
    <Stack>
      <Container
        w={{
          base: "100%",
          md: "80%",
        }}
        fluid
      >
        <Title order={2}>Settings</Title>
        {project}
      </Container>
      <Divider />
      <Container
        w={{
          base: "100%",
          md: "80%",
        }}
        fluid
      >
        <Flex gap={"xl"}>
          <Stack
            w={{
              base: "100%",
              md: "20%",
            }}
            gap={0}
          >
            <NavLink
              active={segment === null}
              c={"white"}
              fw={"bold"}
              onClick={() => {
                router.push(`/overview/${project}/settings`);
              }}
              key={"General"}
              label={"General"}
            />
            {listSettings.map((setting) => (
              <NavLink
                active={segment === _.kebabCase(setting.title)}
                c={"white"}
                fw={"bold"}
                onClick={() => {
                  router.push(
                    setting.link.replace("[project]", project as string)
                  );
                }}
                key={setting.title}
                label={setting.title}
              />
            ))}
          </Stack>
          <Stack
            w={{
              base: "100%",
              md: "70%",
            }}
          >
            {children}
          </Stack>
        </Flex>
      </Container>
    </Stack>
  );
}
