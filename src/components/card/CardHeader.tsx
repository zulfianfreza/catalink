import type { Link } from '@prisma/client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  HiBadgeCheck,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
} from 'react-icons/hi'
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuPencil,
} from 'react-icons/lu'
import useAddThumbnailIconModal from '~/hooks/useAddThumbnailIconModal'
import { trpc } from '~/lib/trpc'
import { cn } from '~/lib/utils'
import { Switch } from '../ui/switch'
import usePreviewLoading from '~/hooks/usePreviewLoading'

interface CardHeaderProps {
  link: Link
  refetch: () => void
  hotReload: () => void
}

enum COLLAPSE {
  INITIAL,
  DELETE,
  POSITION,
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  link,
  refetch,
  hotReload,
}) => {
  const [liveEditTitle, setLiveEditTitle] = useState(false)
  const [position, setPosition] = useState(link.headerPosition ?? 'center')
  const [label, setLabel] = useState(link.label ?? '')
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

  const handleUpdate = ({
    active,
    position,
  }: {
    active?: boolean
    position?: string
  }) => {
    updateLinkMutation.mutateAsync({
      linkId: link.id,
      active,
      label,
      headerPosition: position,
    })
  }

  const handleUpdateActive = () => {
    setActive(!active)
    handleUpdate({ active: !active })
  }

  const onBlurTitle = () => {
    setLiveEditTitle(!liveEditTitle)
    if (label === link.label) return
    handleUpdate({})
  }

  const deleteMutation = trpc.link.deleteLink.useMutation({
    onSuccess: () => {
      refetch()
      hotReload()
      toast.success('success')
    },
  })

  const handleDelete = () => {
    deleteMutation.mutateAsync({ linkId: link.id })
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

  const handleUpdatePosition = (position: string) => {
    handleUpdate({ position })
    setPosition(position)
  }

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

  if (collapse == COLLAPSE.POSITION) {
    collapseBody = (
      <div
        className={cn('  h-0 w-full transition-[height] duration-300', {
          ' h-[160px]': showCollapse,
        })}
      >
        <div className=' relative w-full bg-neutral-300 py-2 text-center text-sm font-medium'>
          <p>Set Position</p>
          <div className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'>
            <HiOutlineX
              size={20}
              className=' '
              onClick={() => handleCloseCollapse(COLLAPSE.POSITION)}
            />
          </div>
        </div>
        <div className=' w-full p-5'>
          <p>Position</p>
          <div className=' mt-2 flex gap-4'>
            <div className=' relative'>
              {position == 'left' && (
                <HiBadgeCheck
                  size={20}
                  className=' absolute -right-2 -top-2 text-green-700'
                />
              )}
              <button
                onClick={() => handleUpdatePosition('left')}
                className=' flex aspect-square h-12 items-center justify-center rounded-lg border'
              >
                <LuAlignLeft size={20} />
              </button>
            </div>
            <div className=' relative'>
              {position == 'center' && (
                <HiBadgeCheck
                  size={20}
                  className=' absolute -right-2 -top-2 text-green-700'
                />
              )}
              <button
                onClick={() => handleUpdatePosition('center')}
                className=' flex aspect-square h-12 items-center justify-center rounded-lg border'
              >
                <LuAlignCenter size={20} />
              </button>
            </div>
            <div className=' relative'>
              {position == 'right' && (
                <HiBadgeCheck
                  size={20}
                  className=' absolute -right-2 -top-2 text-green-700'
                />
              )}
              <button
                onClick={() => handleUpdatePosition('right')}
                className=' flex aspect-square h-12 items-center justify-center rounded-lg border'
              >
                <LuAlignRight size={20} />
              </button>
            </div>
          </div>
        </div>
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
          <div className=' flex min-h-[48px] items-center'>
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
                    <LuPencil
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
            </div>
            <div className=' pr-5'>
              <Switch
                disabled={link.label == ''}
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
                      collapse == COLLAPSE.POSITION,
                  }
                )}
                onClick={() => handleCloseCollapse(COLLAPSE.POSITION)}
              >
                <LuAlignLeft size={20} />
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
