import { Site } from '@prisma/client'
import * as React from 'react'
import { Input } from '../ui/input'
import { trpc } from '~/lib/trpc'
import { toast } from 'react-hot-toast'

interface CardSeoProps {
  site: Site | undefined | null
  refetch: () => void
}
export default function CardSeo({ site, refetch }: CardSeoProps) {
  const [metaTitle, setMetaTitle] = React.useState(site?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = React.useState(
    site?.metaDescription ?? ''
  )

  const updateSiteMutation = trpc.site.updateSiteProfile.useMutation({
    onSuccess() {
      refetch()
      toast.success('success')
    },
  })

  const handleUpdateSite = () => {
    updateSiteMutation.mutateAsync({
      metaTitle: metaTitle ?? '',
      metaDescription: metaDescription ?? '',
    })
  }

  const onBlur = () => {
    handleUpdateSite()
  }

  return (
    <div className=' mt-2 rounded-[24px] bg-white p-6'>
      <h1 className=' font-medium text-gray-800'>Custom Metadata</h1>
      <p className=' text-sm text-gray-500'>
        Changes to metadata may take some time to appear on other platforms.
      </p>
      <div className=' mt-4 space-y-4'>
        <Input
          label='Meta Title'
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          onBlur={onBlur}
        />
        <Input
          label='Meta Description'
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          onBlur={onBlur}
        />
      </div>
    </div>
  )
}
