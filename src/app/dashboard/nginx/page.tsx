'use client'
import React, { Suspense } from "react";
import { Stack, Title } from "@mantine/core";
const NginxListConfig = React.lazy(() => import("../../_components/nginx/ListConfig"));

export default function Nginx() {
    return <Stack>
        <Title order={2}>Nginx</Title>
        <Suspense fallback={<div>Loading...</div>}>
            <NginxListConfig />
        </Suspense>
    </Stack>
}