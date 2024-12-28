import app from "@/constant/app";
import overviewDefault from "@/constant/overview-default";
import { isValidObject } from "@/utils/is-valid-object";
import state from "@/utils/state-value";
import { Stack, Flex, Title, ActionIcon, Divider, Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { MdRefresh } from "react-icons/md";
import { useSnapshot } from "valtio";

const defaultForm = JSON.stringify(overviewDefault, null, 2)
function CreateOverview() {
  const [form, setJsonsetForm] = useState<string | undefined>(defaultForm);
  const [loading, setLoading] = useState<boolean>(false)
  const { setKey } = useSnapshot(state.updateRender)

  async function createOverview() {

    const validate = isValidObject(JSON.parse(defaultForm), JSON.parse(form || ""))
    if (!validate) {
      notifications.show({
        title: "Invalid JSON",
        message: "Please check your JSON | compatible all required fields",
        color: "red",
      })
      return
    }

    const jsonData: typeof overviewDefault = JSON.parse(form || "{}")
    setLoading(true)
    app.api.overviews.create.post({ data: jsonData }).then(({ data }) => {
      if (!data?.success) {
        notifications.show({
          title: "Failed",
          message: data?.message,
          color: "red",
        })
        return
      }

      setJsonsetForm(defaultForm)
      setKey()
      console.log(data, "disini datanya")
      notifications.show({
        title: "Success",
        message: data?.message,
        color: "green",
      })
    }).finally(() => {
      setLoading(false)
    })
  }
  return <Stack style={{
    border: "0.1px solid #6666",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  }}>
    <Flex justify="space-between">
      <Title order={3}>Create Overview</Title>
      <ActionIcon disabled={loading} loading={loading} variant="subtle" onClick={() => setJsonsetForm(defaultForm)}>
        <MdRefresh />
      </ActionIcon>
    </Flex>
    <Divider />
    <Group justify="space-between" align="end">
      <Button disabled={loading || form === defaultForm} loading={loading} onClick={createOverview}>Create</Button>
    </Group>
    <Editor theme="vs-dark" height="60vh" defaultLanguage="json" value={form} onChange={(value) => setJsonsetForm(value)} />
  </Stack>
}

export default CreateOverview