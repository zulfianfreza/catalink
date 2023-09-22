import { Dialog, Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { SOCIAL_ICON_LIST } from '~/lib/data/social-icon'
import { cn, isValidUrl } from '~/lib/utils'
import { IconType } from 'react-icons'
import { HiArrowLeft, HiOutlineX } from 'react-icons/hi'
import { trpc } from '~/lib/trpc'
import { toast } from 'react-hot-toast'
import useSocialIcon from '~/hooks/useSocialIcon'
import useAddSocialIconModal from '~/hooks/useAddSocialIconModal'
import { SocialIcon } from '@prisma/client'
import usePreviewLoading from '~/hooks/usePreviewLoading'

enum STEP {
  LIST = 0,
  ADD = 1,
}

interface ModalAddSocialIconProps {
  socialIcons: SocialIcon[] | null | undefined
}

export default function ModalAddSocialIcon({
  socialIcons,
}: ModalAddSocialIconProps) {
  const [searchIcon, setSearchIcon] = useState()
  const [listIcon, setListIcon] = useState(SOCIAL_ICON_LIST)
  const [step, setStep] = useState(STEP.LIST)
  const [selectedSocial, setSelectedSocial] = useState(0)
  const [urlSocial, setUrlSocial] = useState('')

  const addSocialIconModal = useAddSocialIconModal()

  listIcon.sort((a, b) => {
    let fa = a.label.toLowerCase()
    let fb = b.label.toLowerCase()

    if (fa < fb) return -1
    if (fa > fb) return 1

    return 0
  })

  const handleSearchIcon = (e: any) => {
    const text = e.target.value
    if (text != '') {
      let results = [...SOCIAL_ICON_LIST]
      results = results.filter((icon) => {
        return icon.label.toLowerCase().indexOf(text.toLowerCase()) !== -1
      })
      setListIcon(results)
    } else {
      setListIcon(SOCIAL_ICON_LIST)
    }

    setSearchIcon(e.target.value)
  }

  const handleSelectSocial = (iconId: number) => {
    setStep(step + 1)
    setSelectedSocial(iconId)
  }

  const handleClose = () => {
    addSocialIconModal.onClose()
    setUrlSocial('')
    setTimeout(() => {
      setStep(STEP.LIST)
    }, 300)
  }

  const { hotReloadIframe: refetchSocialIcon } = useSocialIcon()

  const previewLoading = usePreviewLoading()

  const addSocialIconMutation = trpc.socialicon.addSocialIcon.useMutation({
    onMutate: () => {
      previewLoading.setIsLoading(true)
    },
    onSuccess: () => {
      previewLoading.setIsLoading(false)
      toast.success('success')
      handleClose()
      refetchSocialIcon()
    },
  })

  const handleAdd = () => {
    addSocialIconMutation.mutateAsync({
      iconId: selectedSocial,
      url: urlSocial,
      active: true,
    })
  }

  const socialIcon = SOCIAL_ICON_LIST.find((icon) => icon.id == selectedSocial)

  let dialogBody = (
    <div className='px-5'>
      <div className=' pb-2'>
        <Input label='Search' value={searchIcon} onChange={handleSearchIcon} />
      </div>
      <div className=' pb-5'>
        <div className=' max-h-[360px] min-h-[360px] overflow-y-auto'>
          {listIcon.map((icon, index) => (
            <IconItem
              icon={icon}
              key={index}
              disabled={socialIcons?.some(
                (socialIcon) => socialIcon.iconId == icon.id
              )}
              onClick={() => handleSelectSocial(icon.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )

  if (step === STEP.ADD) {
    dialogBody = (
      <div className=' px-5 pb-5'>
        <Input
          label={`Enter ${socialIcon?.label} URL`}
          value={urlSocial}
          onChange={(e) => setUrlSocial(e.target.value)}
        />
        <button
          disabled={!isValidUrl(urlSocial)}
          onClick={handleAdd}
          className=' mt-4 flex h-12 w-full items-center justify-center rounded-full bg-violet-700 font-medium text-white disabled:bg-neutral-300 disabled:text-neutral-400'
        >
          <p>Add</p>
        </button>
      </div>
    )
  }
  return (
    <Transition appear show={addSocialIconModal.isOpen} as={React.Fragment}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto backdrop-blur-sm'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={React.Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95 -translate-y-full'
              enterTo='opacity-100 scale-100 translate-y-0'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100 translate-y-0'
              leaveTo='opacity-0 scale-95 translate-y-full'
            >
              <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all'>
                <div className=' relative p-4 py-6'>
                  {step === STEP.ADD && (
                    <div
                      className=' absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-100'
                      onClick={() => setStep(step - 1)}
                    >
                      <HiArrowLeft className=' ' size={20} />
                    </div>
                  )}
                  <div className=' text-center'>
                    <p className=' font-semibold'>
                      Add {step === STEP.ADD ? socialIcon?.label : null} Icon
                    </p>
                  </div>
                  <div
                    className=' absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-100'
                    onClick={handleClose}
                  >
                    <HiOutlineX className=' ' size={20} />
                  </div>
                </div>
                {dialogBody}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

interface IconItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: {
    label: string
    icon: IconType
  }
  disabled?: boolean
}

function IconItem({
  icon: { label, icon: Icon },
  disabled,
  ...props
}: IconItemProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        ' flex h-[60px] w-full cursor-pointer items-center justify-between rounded-full px-6 font-medium hover:bg-gray-100'
      )}
      {...props}
    >
      <div className='flex items-center gap-x-4'>
        <Icon size={20} />
        {label}
      </div>
      {disabled && <p className=' text-sm text-green-700'> already added</p>}
    </button>
  )
}
