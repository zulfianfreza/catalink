import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { IconType } from 'react-icons'
import { HiArrowLeft, HiOutlineX } from 'react-icons/hi'
import { LuChevronRight } from 'react-icons/lu'
import useAddThumbnailIconModal from '~/hooks/useAddThumbnailIconModal'
import { deleteImageCloudinary } from '~/hooks/useHandleDeleteImage'
import { SOCIAL_ICON_LIST } from '~/lib/data/social-icon'
import { trpc } from '~/lib/trpc'
import { cn } from '~/lib/utils'
import { Input } from '../ui/input'

enum STEP {
  LIST = 0,
  OWN = 1,
  LUCIDE = 2,
}

interface ModalAddThumbnailIconProps {
  refetch: () => void
  hotReload: () => void
}

export default function ModalAddThumbnailIcon({
  refetch,
  hotReload,
}: ModalAddThumbnailIconProps) {
  const [searchIcon, setSearchIcon] = useState()
  const [listIcon, setListIcon] = useState(SOCIAL_ICON_LIST)
  const [step, setStep] = useState(STEP.LIST)

  const addThumbnailIconModal = useAddThumbnailIconModal()

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

  const handleClose = () => {
    addThumbnailIconModal.onClose()
    setTimeout(() => {
      setStep(STEP.LIST)
    }, 300)
  }

  const updateLinkMutation = trpc.link.updateLink.useMutation({
    onSuccess() {
      refetch()
      hotReload()
      toast.success('success')
      handleClose()
    },
  })

  const handleUpdateIcon = (iconId: number) => {
    updateLinkMutation.mutateAsync({
      linkId: addThumbnailIconModal.link.id,
      thumbnailType: 'icon',
      iconId,
    })
  }

  const handleUpdateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File
    if (e.target.files && e.target.files[0]) {
      file = e.target.files[0]
    }

    const formData = new FormData()
    formData.append('file', file!)
    formData.append('upload_preset', 'mzh55kat')

    try {
      if (addThumbnailIconModal.link.imageUrl !== '') {
        await deleteImageCloudinary(addThumbnailIconModal.link.imageUrl ?? '')
      }
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzljovka0/image/upload',
        formData
      )
      console.log(response)
      updateLinkMutation.mutateAsync({
        linkId: addThumbnailIconModal.link.id,
        thumbnailType: 'image',
        imageUrl: response.data.secure_url,
      })
    } catch (error) {
      console.error(error)
    }
  }

  let dialogBody = (
    <div className='flex flex-col gap-2 px-5 pb-8'>
      <div className=''>
        <label
          htmlFor='thumbnail'
          className=' flex w-full cursor-pointer items-center gap-x-4 rounded-xl p-4 hover:bg-gray-100'
        >
          <div className=' flex aspect-square w-12 items-center justify-center rounded-lg bg-violet-300'>
            <div className=' relative aspect-square w-10 overflow-hidden rounded-full'>
              <Image
                src='/images/avatar.png'
                fill
                alt=''
                className=' object-cover'
              />
            </div>
          </div>
          <div className=' flex flex-1 items-center'>
            <div className=' flex flex-1 flex-col items-start gap-x-8'>
              <h1 className=' font-medium text-gray-800'>
                Upload your own thumbnail
              </h1>
              <p className=' text-sm font-light text-gray-500'>
                From your computer.
              </p>
            </div>
            <LuChevronRight />
          </div>
        </label>
        <input
          type='file'
          name=''
          id='thumbnail'
          className=' hidden'
          onChange={handleUpdateImage}
        />
      </div>

      <button
        className=' flex w-full items-center gap-x-4 rounded-xl p-4 hover:bg-gray-100'
        onClick={() => {
          setStep(STEP.LUCIDE)
        }}
      >
        <div className=' relative aspect-square w-12 overflow-hidden rounded-lg'>
          <Image
            src='/images/select-modal--icons.webp'
            fill
            alt='select-modal-icons'
            className=' object-cover'
          />
        </div>
        <div className=' flex flex-1 items-center'>
          <div className=' flex flex-1 flex-col items-start gap-x-8'>
            <h1 className=' font-medium text-gray-800'>
              Choose from Simple Icons
            </h1>
          </div>
          <LuChevronRight />
        </div>
      </button>
    </div>
  )

  if (step === STEP.OWN) {
    dialogBody = <div className=''></div>
  }

  if (step === STEP.LUCIDE) {
    dialogBody = (
      <div className='px-5'>
        <p className=' text-sm font-medium'>
          Icons by{' '}
          <Link href='/' className=' text-violet-700 underline'>
            Simple Icons
          </Link>
        </p>
        <div className=' py-4'>
          <Input
            label='Search icons'
            value={searchIcon}
            onChange={handleSearchIcon}
          />
        </div>
        <div className=' pb-5'>
          <div className=' max-h-[360px] min-h-[360px] overflow-y-auto'>
            <div className=' grid grid-cols-5 gap-2'>
              {listIcon.map((icon) => (
                <button
                  onClick={() => {
                    handleUpdateIcon(icon.id)
                  }}
                  className=' flex aspect-square w-full items-center justify-center rounded-lg border hover:border-black'
                >
                  <icon.icon size={24} className=' text-gray-800' />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Transition appear show={addThumbnailIconModal.isOpen} as={React.Fragment}>
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
                  {step != STEP.LIST && (
                    <div
                      className=' absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-100'
                      onClick={() => setStep(STEP.LIST)}
                    >
                      <HiArrowLeft className=' ' size={20} />
                    </div>
                  )}
                  <div className=' text-center'>
                    <p className=' font-semibold'>Add Thumbnail</p>
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
      {disabled && <p className=' text-sm text-green-700'> ady added</p>}
    </button>
  )
}
