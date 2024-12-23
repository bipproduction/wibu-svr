'use client'
import { Flex, Stack, Title } from "@mantine/core";

// const state = hookstate<string>("x")
export default function Home() {

  return (
    <Flex >
      <Stack>
        <Title>Hello World</Title>
      </Stack>
    </Flex>
  );
}


// function ListOverview() {
//   const [overview, setOverview] = useState<string[] | undefined>(undefined)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false)
//   useShallowEffect(() => {
//     loadOverview()
//   }, [])

//   async function loadOverview() {
//     setLoadingRefresh(true)
//     app.api.overviews.index.get().then(({ data }) => {
//       const overview = data?.data;
//       setOverview(overview)
//     }).finally(() => {
//       setLoadingRefresh(false)
//     })
//   }

//   async function deleteOverview(name: string) {
//     const confirm = window.confirm(`Are you sure you want to delete ${name}?`)
//     if (confirm) {
//       setLoading(true)
//       await app.api.overviews({ name }).delete().then(({ data }) => {
//         if (data?.success) {
//           setOverview(overview?.filter(n => n !== name))
//         }
//       }).finally(() => {
//         setLoading(false)
//       })
//     }
//   }
//   return <Card>
//     <Stack>
//       <Flex justify="space-between">
//         <Title order={3}>List Overview</Title>
//         <Button loading={loadingRefresh} onClick={loadOverview}>Refresh</Button>
//       </Flex>
//       <Divider />
//       {!overview && <Text>Loading...</Text>}
//       <Stack gap="md">
//         {overview?.map((name, key) => (
//           <React.Fragment key={key}>
//             <Flex justify="space-between" gap="md">
//               <PreviewOverview name={name} />
//               <Button disabled={loading} loading={loading} onClick={() => deleteOverview(name)} size="xs">Delete</Button>
//             </Flex>
//             {key < overview.length - 1 && <Divider />}
//           </React.Fragment>
//         ))}
//       </Stack>
//     </Stack>
//   </Card>
// }

// function PreviewOverview({ name }: { name: string }) {
//   const [data, setData] = useState<string | undefined>(undefined)
//   const [loading, setLoading] = useState<boolean>(false)

//   async function loadData() {
//     setLoading(true)
//     app.api.overviews({ name }).get().then(({ data }) => {
//       setData(data?.data)
//     }).finally(() => {
//       setLoading(false)
//     })
//   }

//   if (loading) {
//     return <Text>Loading...</Text>
//   }

//   if (!data) {
//     return <UnstyledButton variant="subtle" onClick={loadData}>{name}</UnstyledButton>
//   }

//   return <Stack bg={"gray"} p={"md"}>
//     <Flex>
//       <CloseButton onClick={() => setData(undefined)} />
//       <Title order={3}>Preview Overview</Title>
//     </Flex>
//     <JsonInput
//       label="Your package.json"
//       placeholder="Textarea will autosize to fit the content"
//       validationError="Invalid JSON"
//       formatOnBlur
//       autosize
//       cols={60}
//       minRows={10}
//       value={data}
//       onChange={() => { }}
//     />
//   </Stack>
// }

// const defaultForm = {
//   name: '',
//   json: ''
// }
// function CreateOverview() {
//   const [form, setJsonsetForm] = useState<typeof defaultForm>(defaultForm);
//   const [loading, setLoading] = useState<boolean>(false)

//   async function createOverview() {
//     if(form.name === "" || form.json){
//       alert("")
//     }
//     setLoading(true)
//     app.api.overviews({ name: form.name }).put(form.json).then(({ data }) => {
//       if (data?.success) {
//         setJsonsetForm(defaultForm)
//       }
//     }).finally(() => {
//       setLoading(false)
//       state.set(Date.now().toString())
//     })
//   }
//   return <Flex p={"md"}>
//     <Stack>
//       <Flex justify="space-between">
//         <Title order={3}>Create Overview</Title>
//         <CloseButton onClick={() => setJsonsetForm(defaultForm)} />
//       </Flex>
//       <TextInput value={form.name} onChange={(e) => setJsonsetForm({ ...form, name: e.target.value })} name="name" label="Name" placeholder="Name" />
//       <JsonInput
//         label="Your package.json"
//         placeholder="Textarea will autosize to fit the content"
//         validationError="Invalid JSON"
//         formatOnBlur
//         autosize
//         cols={60}
//         minRows={10}
//         value={form.json}
//         onChange={(value) => setJsonsetForm({ ...form, json: value })}
//       />
//       <Group justify="end">
//         <Button disabled={loading} loading={loading} onClick={createOverview}>Create</Button>
//       </Group>
//     </Stack>
//   </Flex>
// }
