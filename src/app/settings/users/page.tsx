"use client";

import { Button, Container, Stack, Text } from "@mantine/core";
import { proxy, useSnapshot } from "valtio";

const user = {
  data: "ini",
  nama() {
    console.log(this.data);
  },
  simpan() {
    this.data = "ini adalah data baru";
    this.makana.piring = 90;
  },
  makana: {
    piring: 10,
  },
};

const userState = proxy(user);

export default function Page() {
  const snap = useSnapshot(userState);
  return (
    <Stack>
      <Container
        w={{
          base: "100%",
          md: "80%",
        }}
        fluid
      >
        <Stack>
          <Button onClick={() => userState.simpan()}>Click</Button>
          <Button onClick={() => userState.nama()}>Click</Button>
          <Text>{snap.makana.piring}</Text>
        </Stack>
      </Container>
    </Stack>
  );
}
