/* eslint-disable @typescript-eslint/no-explicit-any */
import app from "@/constant/app";
import stateProccess from "@/utils/state-process";
import { Card, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import moment from "moment";
import { useState } from "react";
import { useSnapshot } from "valtio";

export default function ListProcess() {
    const { data } = useSnapshot(stateProccess);
    const [loading, setLoading] = useState(false);
    useShallowEffect(() => {
        getProcess();
    }, []);

    async function getProcess() {
        try {
            setLoading(true);
            const { data, error } = await app.api.process.index.get();
            if (error) {

                console.log(error);
                return
            }
            stateProccess.setData(data.data as any);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack gap={10} p={10}>
            <Title order={3}>Online</Title>
            <DisplayProcess listItem={data.online as any[]} loading={loading} /> 

            <Title order={3}>Stopped</Title>
            <DisplayProcess listItem={data.stopped as any[]} loading={loading} />

        </Stack>
    );
}

function DisplayProcess({ listItem, loading }: { listItem: any[], loading: boolean }) {
    return <SimpleGrid cols={{
        base: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
    }}>
        {loading ? <Skeleton height={100} /> :
            listItem.map((item, key) => (
                <Card key={key}>
                    <Stack gap={0}>
                        <Title c={item.status === 'online' ? 'green' : 'red'} order={5}>{item.name}</Title>
                        <Text fz={"sm"} c={'gray.5'}>Pid: {item.pid}</Text>
                        <Text fz={"sm"} c={'gray.5'}>Cwd: {item.cwd}</Text>
                        <Text fz={"sm"} c={'gray.5'}>Restart Time: {item.restart_time}</Text>
                        <Text fz={"sm"} c={'gray.5'}>Created At: {moment(item.created_at).format('DD/MM/YYYY HH:mm:ss')}</Text>
                    </Stack>
                </Card>
            ))}
    </SimpleGrid>

}

