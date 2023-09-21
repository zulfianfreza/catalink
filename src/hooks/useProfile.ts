import { trpc } from '~/lib/trpc'

export default function useProfile() {
  const { data, refetch, isLoading } = trpc.user.getCurrentUser.useQuery()

  const hotReloadIframe = async () => {
    const profile = await refetch()
    const iframe = document.getElementById('preview-page') as HTMLIFrameElement

    if (!iframe) return

    iframe.contentWindow?.postMessage(
      {
        type: 'profile-updated',
        profile: profile.data,
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
