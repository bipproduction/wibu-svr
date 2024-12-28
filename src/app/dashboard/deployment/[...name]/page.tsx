/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import app from "@/constant/app";
import { Button, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const { name } = useParams();

    return <Stack>
        <Title order={2}>Deployments {name}</Title>
        <SimpleGrid cols={{
            base: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
        }}>
            <Overview name={name as string} />
            <DeploymentProduction name={name as string} />
        </SimpleGrid>
    </Stack>
}

function Overview({ name }: { name: string }) {
    const [dataOverview, setDataOverview] = useState<any | null>(null)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useShallowEffect(() => {
        loadDataOverview()
    }, [])

    async function loadDataOverview() {

        try {
            setIsLoading(true)
            if (!name) return
            const { data } = await app.api.overviews({ name: name as string }).get()
            setDataOverview(data?.data)
        } catch (error) {
            notifications.show({
                title: "Error",
                message: error as string,
                color: "red",
            })
        } finally {
            setIsLoading(false)
        }

    }

    async function saveDataOverview() {
        setIsLoading(true)
        try {
            const { data } = await app.api.overviews.create.post({ data: dataOverview })
            console.log(data, "disini datanya")
            if (data?.success) {
                setIsEdit(false)
                loadDataOverview()
                return
            }
        } catch (error) {
            notifications.show({
                title: "Error",
                message: error as string,
                color: "red",
            })
        } finally {
            setIsLoading(false)
        }
    }
    return <Stack>
        <Flex justify="space-between">
            <Title order={2}>Overview</Title>
            <Button.Group >
                <Button disabled={isLoading} loading={isLoading} variant="subtle" onClick={() => setIsEdit(!isEdit)}>{isEdit ? "Cancel" : "Edit"}</Button>
                {isEdit && <Button c={"green"} disabled={isLoading} loading={isLoading} variant="subtle" onClick={() => saveDataOverview()}>Save</Button>}
                <Button c={"orange"} disabled={isLoading} loading={isLoading} variant="subtle" onClick={() => loadDataOverview()}>Reload</Button>
            </Button.Group>
        </Flex>
        <Editor
            height={500}
            width="100%"
            theme="vs-dark"
            value={JSON.stringify(dataOverview, null, 2)}
            language="json"
            onChange={(value) => setDataOverview(value)}
            options={{
                minimap: { enabled: false },
                readOnly: !isEdit
            }}
        />
    </Stack>
}


type DeploymentProductionProps = {
    "hasRelease": boolean,
    "sha": string,
    "releases": string[]
}

function DeploymentProduction({ name }: { name: string }) {
    const [dataDeployment, setDataDeployment] = useState<DeploymentProductionProps | null>(null)
    useShallowEffect(() => {
        loadDataDeployment()
    }, [])

    async function loadDataDeployment() {
        if (!name) return
        const { data } = await app.api.deployed.production.update({ name: name as string }).get()
        setDataDeployment(data?.data as DeploymentProductionProps)
    }
    return <Stack>
        <Flex justify="space-between">
            <Title order={2}>Deployment Production</Title>
            <Button variant="subtle" onClick={() => loadDataDeployment()}>Reload</Button>
        </Flex>
        {dataDeployment?.hasRelease ? <Text>Has Release</Text> : <Text>No Release</Text>}
        <Text>SHA: {dataDeployment?.sha}</Text>
        {dataDeployment?.releases.map((release: string) => (
            <Text key={release}>{release}</Text>
        ))}
    </Stack>
}