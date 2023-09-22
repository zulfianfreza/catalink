import { trpc } from '~/lib/trpc'

export default function useSocialIcon() {
  const { data, refetch, isLoading } = trpc.socialicon.getSocialIcon.useQuery()

  const hotReloadIframe = async () => {
    const socialIcon = await refetch()
    const iframe = document.getElementById('preview-page') as HTMLIFrameElement

    if (!iframe) return

    iframe.contentWindow?.postMessage(
      {
        type: 'socialicon-updated',
        socialIcon: socialIcon.data,
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
