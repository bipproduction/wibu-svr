import app from "@/constant/app"
import { ActionIcon, Button, Card, CloseButton, Divider, Flex, Skeleton, Stack, Title, UnstyledButton } from "@mantine/core"
import { useShallowEffect } from "@mantine/hooks"
import { Editor } from "@monaco-editor/react"
import Link from "next/link"
import { useState } from "react"
import { MdRefresh } from "react-icons/md"

function ListOverview() {
  const [overview, setOverview] = useState<string[] | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false)
  const [data, setData] = useState<{ name: string, json: string | undefined } | undefined>(undefined)
  useShallowEffect(() => {
    loadOverview()
  }, [])

  async function loadOverview() {
    setLoadingRefresh(true)
    app.api.overviews.index.get().then(({ data }) => {
      const overview = data?.data;
      setOverview(overview)
    }).finally(() => {
      setLoadingRefresh(false)
    })
  }

  async function deleteOverview(name: string) {
    const confirm = window.confirm(`Are you sure you want to delete ${name}?`)
    if (confirm) {
      setLoading(true)
      await app.api.overviews({ name }).delete().then(({ data }) => {
        if (data?.success) {
          setOverview(overview?.filter(n => n !== name))
        }
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  if (data) {
    return <Stack p={"md"}>
      <Card bg={"dark.8"} withBorder>
        <Stack>
          <Flex justify="space-between">
            <Title order={3}>{data.name}</Title>
            <CloseButton onClick={() => setData(undefined)} />
          </Flex>
          <Divider />
          <Flex justify="end">
            <Button.Group>
              <Button variant="subtle" onClick={() => setData(undefined)}>Cancel</Button>
              <Button variant="subtle" onClick={() => setData(undefined)}>Save</Button>
            </Button.Group>
          </Flex>
          <Editor theme="vs-dark" height="60vh" defaultLanguage="json" defaultValue={data?.json} onChange={(value) => setData({ ...data, json: value })} />
        </Stack>
      </Card>
    </Stack>

  }
  return <Stack p={"md"}>
    <Stack>
      <Flex justify="space-between">
        <Title order={3}>List Overview</Title>
        <ActionIcon disabled={loadingRefresh} loading={loadingRefresh} variant="subtle" onClick={loadOverview}>
          <MdRefresh />
        </ActionIcon>
      </Flex>
      <Divider />
      {overview?.map((name, key) => (
        <Card key={key}>
          <Stack key={key}>
            <Flex justify="space-between" gap="md">
              <PreviewOverview name={name} onData={(json) => setData({ name, json })} />
              <Flex>
                <Button variant="subtle" disabled={loading} loading={loading} onClick={() => deleteOverview(name)} size="xs">Delete</Button>
                <Button variant="subtle" component={Link} href={`/dashboard/deployment/${name.replace(".json", "")}`} size="xs">Deploy</Button>
              </Flex>
            </Flex>
          </Stack>
        </Card>
      ))}
    </Stack>
  </Stack>

}

function PreviewOverview({ name, onData }: { name: string, onData: (data: string | undefined) => void }) {

  const [loading, setLoading] = useState<boolean>(false)

  async function loadData() {
    setLoading(true)
    app.api.overviews({ name }).get().then(({ data, error }) => {
      if (error || !data.data) {
        console.error(error)
        return
      }
      onData(JSON.stringify(data?.data, null, 2))
    }).finally(() => {
      setLoading(false)
    })
  }

  if (loading) {
    return <Skeleton height={20} />
  }

  return <UnstyledButton c={"blue"} disabled={loading} variant="subtle" onClick={loadData}>{name}</UnstyledButton>

}

export default ListOverview