import {
    Container,
    EmptyState,
    Flex,
    Heading,
    Table,
    VStack,
  } from "@chakra-ui/react"
  import { useQuery } from "@tanstack/react-query"
  import { createFileRoute, useNavigate } from "@tanstack/react-router"
  import { FiSearch } from "react-icons/fi"
  import { z } from "zod"
  import { ItemActionsMenu } from "@/components/Common/ItemActionsMenu"
  import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
  } from "@/components/ui/pagination.tsx"
  
const postSearchSchema = z.object({
    page: z.number().catch(1),
})

const PER_PAGE = 5

const ItemPost = [
    { id: "1", title: "Item 1", description: "This is item 1", owner_id:"101" },
    { id: "2", title: "Item 2", description: "This is item 2", owner_id:"101 "},
    { id: "3", title: "Item 3", description: "", owner_id: "102" },
    { id: "4", title: "Item 4", description: "This is item 4", owner_id: "103" },
    { id: "5", title: "Item 5", description: "This is item 5", owner_id: "104" },
    { id: "6", title: "Item 6", description: "This is item 6", owner_id: "105" },
  ]
  
export const Route = createFileRoute('/_layout/post')({
    component: Post,
    validateSearch: (search) => postSearchSchema.parse(search),
})

function PostTable() {
    const navigate = useNavigate({ from: Route.fullPath })
    const { page } = Route.useSearch()
    const currentPage = page || 1

    // const { data, isLoading, isPlaceholderData } = useQuery({
    //     ...getPostQueryOptions({ page }),
    //     placeholderData: (prevData) => prevData,
    // })
    const setPage = (page: number) =>
        navigate({
            search: (prev: { [key: string]: string }) => ({ ...prev, page }),
        })
    // const items = data?.data.slice(0, PER_PAGE) ?? []
    // const count = data?.count ?? 0
    const start = (currentPage - 1) * PER_PAGE
    const end = start + PER_PAGE
    const items = ItemPost.slice(start, end)
    const count = ItemPost.length

    // if (isLoading) {
    //     return <PendingPost />
    //   }
    if (items.length === 0) {
        return (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <FiSearch />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>You don't have any items yet</EmptyState.Title>
                <EmptyState.Description>
                  Add a new post to get started
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        )
      }

      return (
        <>
          <Table.Root size={{ base: "sm", md: "md" }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="sm">ID</Table.ColumnHeader>
                <Table.ColumnHeader w="sm">Title</Table.ColumnHeader>
                <Table.ColumnHeader w="sm">Description</Table.ColumnHeader>
                <Table.ColumnHeader w="sm">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell truncate maxW="sm">
                    {item.id}
                  </Table.Cell>
                  <Table.Cell truncate maxW="sm">
                    {item.title}
                  </Table.Cell>
                  <Table.Cell
                    color={!item.description ? "gray" : "inherit"}
                    truncate
                    maxW="30%"
                  >
                    {item.description || "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    <ItemActionsMenu item={item} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex justifyContent="flex-end" mt={4}>
            <PaginationRoot
              count={count}
              pageSize={PER_PAGE}
              onPageChange={({ page }) => setPage(page)}
            >
              <Flex>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </Flex>
            </PaginationRoot>
          </Flex>
        </>
      )


   
}
function Post() {
    return (
        <Container maxW="full">
            <Heading size="lg" pt={12}>
                Post Management
            </Heading>
            {/* <AddPost/> */}
        <PostTable />
        </Container>
    )
}
