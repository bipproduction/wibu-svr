import app from "@/constant/app"
import state from "@/utils/state-value"
import { ActionIcon, Box, Button, Card, Flex, Skeleton, Stack, Text, Title, UnstyledButton } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { Editor } from "@monaco-editor/react"
import { useState } from "react"
import { MdClose, MdEdit, MdSave } from "react-icons/md"
import { useSnapshot } from "valtio"

function NginxListConfig() {
    const [listConfig, setListConfig] = useState<string[] | undefined>(undefined)
    const [iseEdit, setIsEdit] = useState<boolean>(false)
    const { name, data, setData } = useSnapshot(state.nginx.config)

    useShallowEffect(() => {
        loadConfig()
    }, [])
    async function loadConfig() {
        const { data } = await app.api.nginx.config.get()
        setListConfig(data?.data)
    }

    if (!listConfig) {
        return <Text>Loading...</Text>
    }

    if (data !== "") {
        return <Preview />
    }

    return (
        <Stack w={"100%"} p={"md"} gap={"md"}>
            <Box>
                <Card miw={360}>
                    <Stack>
                        <Title>Config</Title>
                        {listConfig.map((config) => {
                            return <LoadTextConfig key={config} name={config} />
                        })}
                    </Stack>
                </Card>
            </Box>

        </Stack>
    )

    function Preview() {
        return <Card miw={360}>
            <Stack >
                <Flex justify={"flex-end"}>
                    <Button.Group >
                        <Button onClick={() => setIsEdit(!iseEdit)} variant="subtle">
                            {iseEdit ? <MdClose /> : <MdEdit />}
                        </Button>
                        <Button onClick={() => setData("")} variant="subtle">
                            <MdClose />
                        </Button>
                    </Button.Group>
                </Flex>
                {!iseEdit ? <ConfigPreview /> : <EditConfig name={name} dataText={data} />}
            </Stack>
        </Card>
    }
}

function ConfigPreview() {
    const { name, data } = useSnapshot(state.nginx.config)
    return <Card >
        <Stack gap={"md"} justify={"space-between"}>
            <Text>{name}</Text>
            <Editor
                theme="vs-dark"
                height="500px"
                defaultLanguage="nginx"
                value={data}
            />
        </Stack>
    </Card>
}

function LoadTextConfig({ name }: { name: string }) {
    const { setData, setName } = useSnapshot(state.nginx.config)
    const [loading, setLoading] = useState(false)
    if (loading) {
        return <Flex>
            <Skeleton height={20} />
        </Flex>
    }
    return <Flex>
        <UnstyledButton c={loading ? "gray" : "blue"} disabled={loading} onClick={async () => {
            setLoading(true)
            const { data } = await app.api.nginx.config({ name }).get()
            setData(data?.data ?? "")
            setName(name)
            setLoading(false)
        }}>{name}</UnstyledButton>
    </Flex>
}

function EditConfig({ name, dataText, setDataText }: { name: string, dataText: string, setDataText?: (text: string | undefined) => void }) {
    return <Stack gap={"md"}>
        <Card miw={360}>
            <Stack>
                <Flex justify="space-between">
                    <Title order={3}>Edit Config</Title>
                </Flex>
                <Flex justify="space-between">
                    <Text>{name}</Text>
                    <ActionIcon onClick={() => { }}>
                        <MdSave />
                    </ActionIcon>
                </Flex>
                <Editor
                    theme="vs-dark"
                    height="500px"
                    defaultLanguage="nginx"
                    defaultValue={dataText}
                    onChange={(value) => {
                        setDataText?.(value)
                    }}
                />

            </Stack>
        </Card>
    </Stack>
}

export default NginxListConfig