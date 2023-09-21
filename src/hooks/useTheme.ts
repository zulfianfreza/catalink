import { trpc } from '~/lib/trpc'

export default function useTheme() {
  const { data, refetch, isLoading } = trpc.theme.getTheme.useQuery()

  const hotReloadIframe = async () => {
    const theme = await refetch()
    const iframe = document.getElementById('preview-page') as HTMLIFrameElement

    if (!iframe) return

    iframe.contentWindow?.postMessage(
      {
        type: 'theme-updated',
        theme: theme.data,
      },
      '*'
    )
  }

  return {
    data,
    hotReloadIframe,
    isLoading,
  }
}
