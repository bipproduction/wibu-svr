'use client'
import { SimpleGrid, Skeleton, Stack, Title } from "@mantine/core";
import React, { Suspense } from "react";
const CreateOverview = React.lazy(() => import("./_lib/componets/CreateOverview"));
const ListOverview = React.lazy(() => import("./_lib/componets/ListOverview"));

export default function Page() {
    return <Stack>
        <Title order={2}>Overview</Title>
        <SimpleGrid cols={{
            base: 1,
            md: 2
        }}>
            <Suspense fallback={<Skeleton height={400} />}>
                <CreateOverview />
            </Suspense>
            <Suspense fallback={<Skeleton height={400} />}>
                <ListOverview />
            </Suspense>
        </SimpleGrid>
    </Stack>
}