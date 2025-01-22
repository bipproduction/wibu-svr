/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleGrid, Stack, Tabs } from "@mantine/core";
import { ServerConfig } from "@prisma/client";
import { stateDomains } from "../_state/stste_domains";
import DomainContent from "./DomainContent";

function DisplayConfig({ domains }: { domains: any }) {
  return (
    <Stack>
      <Tabs defaultValue={domains.data[0].name}>
        <Tabs.List>
          {domains.data.map((domain: any, key: any) => (
            <Tabs.Tab
              key={key}
              value={domain.name}
              onClick={() => (stateDomains.selectedDomain = key)}
            >
              {domain.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value={domains.data[domains.selectedDomain].name}>
          <Stack p={"md"}>
            <SimpleGrid
              cols={{
                base: 1,
                md: 2,
              }}
            >
              {domains.data[domains.selectedDomain].ServerConfig.map(
                (serverConfig: any) => (
                  <DomainContent
                    key={serverConfig.id}
                    value={serverConfig as ServerConfig}
                  />
                )
              )}
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

export default DisplayConfig;
