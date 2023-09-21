import { trpc } from '~/lib/trpc'

export default function useLinks() {
  const { data, refetch } = trpc.link.getLinks.useQuery()

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

  return {
    data,
    hotReloadIframe,
  }
}
