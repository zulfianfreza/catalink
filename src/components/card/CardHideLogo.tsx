import { Theme } from '@prisma/client'
import React from 'react'
import { toast } from 'react-hot-toast'
import { trpc } from '~/lib/trpc'
import { Switch } from '../ui/switch'
import Logo from '../Logo'
import usePreviewLoading from '~/hooks/usePreviewLoading'

interface CardHideLogoProps {
  theme: Theme | null | undefined
  refetch: () => void
}

export default function CardHideLogo({ theme, refetch }: CardHideLogoProps) {
  const [hideLogo, setHideLogo] = React.useState<boolean>(
    theme?.hideLogo ?? false
  )

  const previewLoading = usePreviewLoading()

  const updateThemeMutation = trpc.theme.updateTheme.useMutation({
    onMutate: () => {
      previewLoading.setIsLoading(true)
    },
    onSuccess() {
      previewLoading.setIsLoading(false)
      refetch()
      toast.success('success')
    },
  })

  const handleHideLogo = () => {
    setHideLogo(!hideLogo)
    updateThemeMutation.mutateAsync({ hideLogo: !hideLogo })
  }
  return (
    <div className=' w-full rounded-[24px] bg-white p-6'>
      <div className='flex justify-between'>
        <p className=' font-medium text-gray-800'>Hide the Logo</p>
        <Switch
          className=' data-[state=checked]:bg-green-700 data-[state=unchecked]:bg-gray-200'
          checked={hideLogo}
          onCheckedChange={handleHideLogo}
        />
      </div>
      <Logo className=' mt-4' />
    </div>
  )
}
