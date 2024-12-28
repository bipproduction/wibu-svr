'use client'
import { Title } from "@mantine/core";
import React, { Suspense } from "react";
import { Stack } from "@mantine/core";
const ListProcess = React.lazy(() => import("../../_components/process/ListProcess"));

function Process() {
    return <Stack>
        <Title order={2}>Process</Title>
        <Suspense fallback={<div>Loading...</div>}>
            <ListProcess />
        </Suspense>
    </Stack>
}

export default Process