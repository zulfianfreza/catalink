import { SocialIcon, Theme } from '@prisma/client'
import React, { useState } from 'react'
import SocialIconItem from '../SocialIconItem'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { toast } from 'react-hot-toast'
import { trpc } from '~/lib/trpc'
import useTheme from '~/hooks/useTheme'
import useAddSocialIconModal from '~/hooks/useAddSocialIconModal'
import ModalAddSocialIcon from '../modal/ModalAddSocialIcon'
import ModalEditSocialIcon from '../modal/ModalEditSocialIcon'
import usePreviewLoading from '~/hooks/usePreviewLoading'

interface CardSocialIconProps {
  socialIcons: SocialIcon[] | undefined
  theme: Theme | null | undefined
}

export default function CardSocialIcon({
  socialIcons,
  theme,
}: CardSocialIconProps) {
  const addSocialIconModal = useAddSocialIconModal()
  const [socialIconPosition, setSocialIconPosition] = useState(
    theme?.socialIconPosition ?? 'top'
  )

  const { hotReloadIframe } = useTheme()

  const previewLoading = usePreviewLoading()

  const updateSocialIconPositionMutation = trpc.theme.updateTheme.useMutation({
    onMutate: () => {
      previewLoading.setIsLoading(true)
    },
    onSuccess: () => {
      previewLoading.setIsLoading(false)
      toast.success('success')
      hotReloadIframe()
    },
  })

  const handleUpdateSocialIconPosition = (position: string) => {
    updateSocialIconPositionMutation.mutateAsync({
      socialIconPosition: position,
    })
    setSocialIconPosition(position)
  }
  return (
    <>
      <div className=' mt-2 rounded-[24px] bg-white p-6'>
        <div className=' flex items-center justify-between gap-x-8'>
          <div className=' flex flex-1 flex-col'>
            <h2 className=' font-medium text-gray-900'>Be Iconic</h2>
            <p className=' text-sm text-gray-500'>
              Add icons linking to your social profiles, github and more.
            </p>
          </div>
          <button
            className=' flex h-12 items-center justify-center rounded-full bg-violet-700 px-4 text-sm font-medium text-white'
            onClick={addSocialIconModal.onOpen}
          >
            Add Icon
          </button>
        </div>
        <div className=' mt-4 flex justify-end'></div>
        <div className=' mt-4'>
          {socialIcons?.map((socialIcon) => (
            <SocialIconItem socialIcon={socialIcon} key={socialIcon.id} />
          ))}
        </div>
        <div className=' mt-4'>
          <div className=''>
            <h2 className=' font-medium text-gray-900'>Position</h2>
            <p className=' text-sm text-gray-500'>Display social icon at:</p>
          </div>
          <RadioGroup defaultValue={socialIconPosition} className=' mt-4'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem
                value='top'
                id='top'
                onClick={() => handleUpdateSocialIconPosition('top')}
              />
              <label htmlFor='top' className=' text-sm'>
                Top
              </label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem
                value='bottom'
                id='bottom'
                onClick={() => handleUpdateSocialIconPosition('bottom')}
              />
              <label htmlFor='bottom' className=' text-sm'>
                Bottom
              </label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <ModalAddSocialIcon socialIcons={socialIcons} />
      <ModalEditSocialIcon />
    </>
  )
}
