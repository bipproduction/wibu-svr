"use client";

import { Container } from "@mantine/core";
import { useSnapshot } from "valtio";
import ProjectCreateModal from "./_com/ProjectCreateModal";
import ProjectsViews from "./_com/ProjectViews";
import overviewState from "./_state/state_overview";

export default function Page() {
  const snapshot = useSnapshot(overviewState);
  if (snapshot.isCreateOpen) {
    return <ProjectCreateModal />;
  }
  return (
    <Container
      w={{
        base: "100%",
        md: "80%",
      }}
      fluid
    >
      <ProjectsViews />
    </Container>
  );
}
