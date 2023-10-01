import { Link } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import { toast } from 'react-hot-toast'
import AddLink from '~/components/AddLink'
import ContentContainer from '~/components/ContentContainer'
import EmptyState from '~/components/EmptyState'
import Logo from '~/components/Logo'
import { StrictModeDroppable } from '~/components/StrictModeDroppable'
import { CardHeader, CardLink } from '~/components/card'
import { CardTextLink } from '~/components/card/CardTextLink'
import { CardYoutube } from '~/components/card/CardYoutube'
import ModalAddThumbnailIcon from '~/components/modal/ModalAddThumbnailIcon'
import { DashboardTemplate } from '~/components/template'
import usePreviewLoading from '~/hooks/usePreviewLoading'
import { prisma } from '~/lib/db'
import { trpc } from '~/lib/trpc'

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([])

  const { data, isLoading, refetch } = trpc.link.getLinks.useQuery(undefined, {
    onSuccess(data) {
      setLinks(data)
    },
  })

  const dataLinks = links ? links : data

  const hotReloadIframe = async () => {
    const links = await refetch()
    const iframe = document.getElementById('preview-page') as HTMLIFrameElement

    if (!iframe) return

    iframe.contentWindow?.postMessage(
      {
        type: 'links-updated',
        links: links.data,
      },
      '*'
    )
  }

  const previewLoading = usePreviewLoading()

  const reorderMutation = trpc.link.reorderLinkPosition.useMutation({
    onMutate: () => {
      previewLoading.setIsLoading(true)
    },
    onSuccess: () => {
      previewLoading.setIsLoading(false)
      refetch(), hotReloadIframe(), toast.success('success')
    },
  })

  const reorderLinksMutation = async (
    id: string,
    newIndex: number,
    oldIndex: number
  ) => {
    reorderMutation.mutateAsync({ linkId: id, newIndex, oldIndex })
  }

  const reorderLinks = async (result: DropResult) => {
    const id = result.draggableId
    const newIndex = result.destination?.index ?? -1
    const oldIndex = result.source.index
    const { source, destination, draggableId } = result

    if (
      !destination ||
      (source.index === destination.index &&
        source.droppableId === destination.droppableId)
    ) {
      return
    }

    const newLinks = [...links]
    const [removed] = newLinks.splice(source.index, 1)
    newLinks.splice(destination.index, 0, removed!)

    setLinks(newLinks as Link[])

    console.log(newIndex, oldIndex)

    if (id && newIndex >= 0 && oldIndex >= 0) {
      await reorderLinksMutation(id, newIndex, oldIndex)
    }
  }
  return (
    <DashboardTemplate>
      <NextSeo title='Dashboard - Circle' />
      <ContentContainer>
        <AddLink refetch={hotReloadIframe} />
        {isLoading ? (
          <div className=' flex h-full w-full flex-col items-center justify-center gap-y-4'>
            <svg
              className='-ml-1 mr-3 h-5 w-5 animate-spin text-violet-700'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx={12}
                cy={12}
                r={10}
                stroke='currentColor'
                strokeWidth={4}
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          </div>
        ) : dataLinks?.length == 0 ? (
          <EmptyState />
        ) : (
          <DragDropContext onDragEnd={reorderLinks}>
            <StrictModeDroppable droppableId='links'>
              {(provided) => (
                <ul
                  className='links mt-8 flex w-full flex-col gap-y-4'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {dataLinks?.map((link, i) => (
                    <Draggable draggableId={link.id} key={link.id} index={i}>
                      {(provided) => (
                        <li
                          className=' hover:cursor-default'
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                        >
                          {link.type == 'link' ? (
                            <CardLink
                              link={link}
                              refetch={refetch}
                              hotReload={hotReloadIframe}
                            />
                          ) : link.type == 'text-link' ? (
                            <CardTextLink
                              link={link}
                              refetch={refetch}
                              hotReload={hotReloadIframe}
                            />
                          ) : link.type == 'header' ? (
                            <CardHeader
                              link={link}
                              refetch={refetch}
                              hotReload={hotReloadIframe}
                            />
                          ) : link.type == 'youtube' ? (
                            <CardYoutube
                              link={link}
                              refetch={refetch}
                              hotReload={hotReloadIframe}
                            />
                          ) : null}
                        </li>
                      )}
                    </Draggable>
                  ))}
                </ul>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        )}
      </ContentContainer>
      <ModalAddThumbnailIcon refetch={refetch} hotReload={hotReloadIframe} />
    </DashboardTemplate>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  })

  const links = await prisma.link.findMany({
    where: {
      userId: user?.id ?? null,
    },
    orderBy: [{ index: 'asc' }],
  })

  if (user?.username == null || !user?.username) {
    return {
      redirect: {
        destination: '/information',
        permanent: false,
      },
    }
  }
  return {
    props: {
      links,
    },
  }
}
