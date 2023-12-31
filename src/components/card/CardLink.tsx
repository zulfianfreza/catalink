import type { Link } from '@prisma/client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  HiOutlineChartBar,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
} from 'react-icons/hi'
import { cn } from '~/lib/utils'
import { Switch } from '../ui/switch'
import { trpc } from '~/lib/trpc'
import { Tooltip } from 'react-tooltip'
import { LuImage, LuPencil } from 'react-icons/lu'
import ModalAddThumbnailIcon from '../modal/ModalAddThumbnailIcon'
import useAddThumbnailIconModal from '~/hooks/useAddThumbnailIconModal'
import { SOCIAL_ICON_LIST } from '~/lib/data/social-icon'
import Icon from '../Icon'
import Image from 'next/image'
import usePreviewLoading from '~/hooks/usePreviewLoading'

interface CardLinkProps {
  link: Link
  refetch: () => void
  hotReload: () => void
}

enum COLLAPSE {
  INITIAL,
  DELETE,
  THUMBNAIL,
}

export const CardLink: React.FC<CardLinkProps> = ({
  link,
  refetch,
  hotReload,
}) => {
  const [liveEditTitle, setLiveEditTitle] = useState(false)
  const [liveEditContent, setLiveEditContent] = useState(false)
  const [label, setLabel] = useState(link.label ?? '')
  const [content, setContent] = useState(link.content ?? '')
  const [active, setActive] = useState(link.active ?? true)
  const [showCollapse, setShowCollapse] = useState(false)
  const [collapse, setCollapse] = useState(COLLAPSE.INITIAL)

  const addThumbnailIconModal = useAddThumbnailIconModal()

  const previewLoading = usePreviewLoading()

  const updateLinkMutation = trpc.link.updateLink.useMutation({
    onMutate: () => {
      previewLoading.setIsLoading(true)
    },
    onSuccess() {
      previewLoading.setIsLoading(false)
      refetch()
      toast.success('Success')
      hotReload()
    },
  })

  const handleUpdate = (active?: boolean) => {
    updateLinkMutation.mutateAsync({ linkId: link.id, active, label, content })
  }

  const handleUpdateActive = () => {
    setActive(!active)
    handleUpdate(!active)
  }

  const onBlurTitle = () => {
    setLiveEditTitle(!liveEditTitle)
    if (label === link.label) return
    handleUpdate()
  }

  const onBlurContent = () => {
    setLiveEditContent(!liveEditContent)
    if (content === link.content) return
    handleUpdate()
  }

  const deleteMutation = trpc.link.deleteLink.useMutation({
    onMutate: () => {
      previewLoading.setIsLoading(true)
    },
    onSuccess: () => {
      previewLoading.setIsLoading(false)
      refetch()
      hotReload()
      toast.success('success')
    },
  })

  const handleDelete = () => {
    deleteMutation.mutateAsync({ linkId: link.id })
  }

  const handleAddThumbnailIconModal = () => {
    addThumbnailIconModal.onOpen()
    addThumbnailIconModal.setLink(link)
  }

  const handleCloseCollapse = (data: COLLAPSE) => {
    if (collapse == data) {
      setTimeout(() => {
        setCollapse(COLLAPSE.INITIAL)
      }, 300)
    }
    setCollapse(data)
    setShowCollapse(collapse == data ? !showCollapse : true)
  }

  const handleDeleteThumbnail = () => {
    updateLinkMutation.mutateAsync({
      linkId: link.id,
      thumbnailType: '',
      iconId: 0,
      imageUrl: '',
    })
  }

  const socialIcon = SOCIAL_ICON_LIST.find((icon) => icon.id == link.iconId)

  let collapseBody = (
    <div
      className={cn('  h-0 w-full transition-[height] duration-300', {
        ' h-[150px]': showCollapse,
      })}
    ></div>
  )

  if (collapse == COLLAPSE.DELETE) {
    collapseBody = (
      <div
        className={cn('  h-0 w-full transition-[height] duration-300', {
          ' h-[150px]': showCollapse,
        })}
      >
        <div className=' relative w-full bg-neutral-300 py-2 text-center text-sm font-medium'>
          <p>Delete</p>
          <div className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'>
            <HiOutlineX
              size={20}
              className=' '
              onClick={() => handleCloseCollapse(COLLAPSE.DELETE)}
            />
          </div>
        </div>
        <div className=' space-y-2 p-4'>
          <p className=' text-center text-sm'>Are u sure?</p>
          <div className='flex justify-between gap-x-2'>
            <button
              className=' flex h-12 flex-1 items-center justify-center rounded-full border border-black text-sm font-medium'
              onClick={() => handleCloseCollapse(COLLAPSE.DELETE)}
            >
              <p>Cancel</p>
            </button>
            <button
              className=' tesm flex h-12 flex-1 items-center justify-center rounded-full bg-violet-700 font-medium text-white'
              onClick={handleDelete}
            >
              <p>Delete</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (collapse == COLLAPSE.THUMBNAIL) {
    collapseBody = (
      <div
        className={cn(
          '  h-0 w-full transition-[height] duration-300',
          {
            ' h-[150px]': showCollapse,
          },
          {
            'h-[175px]':
              showCollapse &&
              link.thumbnailType != null &&
              link.thumbnailType != '',
          }
        )}
      >
        <div className=' relative w-full bg-neutral-300 py-2 text-center text-sm font-medium'>
          <p>Add Thumbnail</p>
          <div className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'>
            <HiOutlineX
              size={20}
              className=' '
              onClick={() => handleCloseCollapse(COLLAPSE.THUMBNAIL)}
            />
          </div>
        </div>
        {link.thumbnailType !== null && link.thumbnailType !== '' ? (
          <div className=' flex w-full items-start gap-4 p-4'>
            {link.thumbnailType == 'icon' ? (
              <Icon
                icon={socialIcon?.icon ?? SOCIAL_ICON_LIST[0]!.icon}
                size={80}
              />
            ) : (
              <div className=' relative aspect-square w-20 overflow-hidden rounded-lg'>
                <Image
                  src={link.imageUrl ?? ''}
                  fill
                  alt=''
                  className=' object-cover'
                />
              </div>
            )}
            <div className=' flex-1 space-y-2'>
              <button
                className=' flex h-12 w-full flex-1 items-center justify-center rounded-full bg-violet-700 text-sm font-medium text-white'
                onClick={handleAddThumbnailIconModal}
              >
                <p>Change</p>
              </button>
              <button
                className=' flex h-12 w-full flex-1 items-center justify-center rounded-full border  text-sm font-medium text-gray-800'
                onClick={handleDeleteThumbnail}
              >
                <p>Remove</p>
              </button>
            </div>
          </div>
        ) : (
          <div className=' space-y-2 p-4'>
            <p className=' text-center text-sm'>
              Add a thumbnail or Icon to this Link.
            </p>
            <button
              className=' tesm flex h-12 w-full flex-1 items-center justify-center rounded-full bg-violet-700 font-medium text-white'
              onClick={handleAddThumbnailIconModal}
            >
              <p>Set Thumbnail</p>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className=' w-full overflow-hidden rounded-[24px] bg-white shadow-sm'>
      <div className='flex'>
        {/* KIRI */}
        <div className='flex cursor-grab items-center  p-4 text-gray-500 hover:text-gray-900'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='hover:cursor-grab'
            role='img'
            aria-hidden='false'
            aria-labelledby='ltclid31_title '
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M5 4C5.55228 4 6 3.55228 6 3C6 2.44772 5.55228 2 5 2C4.44772 2 4 2.44772 4 3C4 3.55228 4.44772 4 5 4ZM6 8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8C4 7.44772 4.44772 7 5 7C5.55228 7 6 7.44772 6 8ZM6 13C6 13.5523 5.55228 14 5 14C4.44772 14 4 13.5523 4 13C4 12.4477 4.44772 12 5 12C5.55228 12 6 12.4477 6 13ZM12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8C10 7.44772 10.4477 7 11 7C11.5523 7 12 7.44772 12 8ZM11 14C11.5523 14 12 13.5523 12 13C12 12.4477 11.5523 12 11 12C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14ZM12 3C12 3.55228 11.5523 4 11 4C10.4477 4 10 3.55228 10 3C10 2.44772 10.4477 2 11 2C11.5523 2 12 2.44772 12 3Z'
              fill='currentColor'
            ></path>
          </svg>
        </div>
        {/* TENGAH */}
        <div className=' flex-1  overflow-hidden py-5 pl-5'>
          <div className=' flex items-center'>
            <div className=' flex flex-1 flex-col gap-1 overflow-hidden pr-10'>
              <div className=' flex items-center gap-x-2'>
                {!liveEditTitle ? (
                  <>
                    <p
                      className={cn('  font-medium text-gray-800', {
                        'text-gray-500': label == '',
                      })}
                    >
                      {label != '' ? label : 'Title'}
                    </p>
                    <HiOutlinePencil
                      className=' cursor-pointer text-gray-500 hover:text-gray-800'
                      onClick={() => {
                        setLiveEditTitle(!liveEditTitle)
                      }}
                    />
                  </>
                ) : (
                  <input
                    type='text'
                    autoFocus
                    onBlur={onBlurTitle}
                    defaultValue={label}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className=' w-full font-medium focus:outline-none'
                  />
                )}
              </div>

              <div className=' flex w-full items-center gap-x-2'>
                {!liveEditContent ? (
                  <>
                    <div className=' flex w-full items-center gap-x-2'>
                      <p
                        className={cn(
                          'max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-600',
                          { 'text-gray-500': content == '' }
                        )}
                        onClick={() => {
                          setLiveEditContent(!liveEditContent)
                        }}
                      >
                        {content != '' ? content : 'URL'}
                      </p>
                      <button
                        onClick={() => {
                          setLiveEditContent(!liveEditContent)
                        }}
                        className=' flex cursor-pointer text-gray-500 hover:text-gray-800'
                      >
                        <LuPencil size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <input
                    type='text'
                    autoFocus
                    onBlur={onBlurContent}
                    defaultValue={content}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className=' w-full  text-sm focus:outline-none'
                  />
                )}
              </div>
            </div>
            <div className=' pr-5'>
              <Switch
                disabled={link.label == '' || link.content == ''}
                className=' data-[state=checked]:bg-green-700 data-[state=unchecked]:bg-gray-200'
                checked={active}
                onCheckedChange={handleUpdateActive}
              />
            </div>
          </div>

          <div className=' mt-2 flex w-full items-center  '>
            <div className=' flex flex-1 gap-x-1'>
              <button
                className={cn(
                  ' rounded-lg p-1.5 text-gray-500 hover:bg-gray-100',
                  {
                    'bg-violet-700 text-white hover:bg-violet-700 hover:text-white':
                      collapse == COLLAPSE.THUMBNAIL,
                  }
                )}
                onClick={() => handleCloseCollapse(COLLAPSE.THUMBNAIL)}
              >
                <LuImage size={20} />
              </button>
              <button className=' flex gap-x-1 rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100'>
                <HiOutlineChartBar className=' text-gray-500' size={20} />
                {link.clickCount} clicks
              </button>
              <button
                className={cn(
                  ' rounded-lg p-1.5 text-gray-500 hover:bg-gray-100',
                  {
                    'bg-violet-700 text-white hover:bg-violet-700 hover:text-white':
                      collapse == COLLAPSE.DELETE,
                  }
                )}
                onClick={() => handleCloseCollapse(COLLAPSE.DELETE)}
              >
                <HiOutlineTrash size={20} />
              </button>
            </div>
            <div className=' pr-5'></div>
          </div>
        </div>
      </div>
      {collapseBody}
    </div>
  )
}
