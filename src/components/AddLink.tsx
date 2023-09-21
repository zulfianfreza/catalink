'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiChevronDoubleRight, HiX } from 'react-icons/hi'
import { LuPlus } from 'react-icons/lu'
import { SiYoutube } from 'react-icons/si'
import { trpc } from '~/lib/trpc'
import { cn, isValidUrl } from '~/lib/utils'
import { Input } from './ui/input'

interface AddLinkProps {
  refetch: () => void
}

export default function AddLink({ refetch }: AddLinkProps) {
  const [addLink, setAddLink] = useState<boolean>(false)
  const [url, setUrl] = useState('')
  const [displayDialog, setDisplayDialog] = useState(false)

  const createLinkMutation = trpc.link.createLink.useMutation({
    onSuccess: () => {
      setUrl('')
      setAddLink(!addLink)
      toast.success('success')
      refetch()
    },
  })

  const handleCreateLink = () => {
    createLinkMutation.mutateAsync({
      type: 'link',
      label: 'Title',
      content: url,
    })
  }

  const handleCreateHeader = () => {
    createLinkMutation.mutateAsync({
      type: 'header',
      label: 'Title',
    })
  }

  const handleCreateLinkYoutube = () => {
    createLinkMutation.mutateAsync({
      type: 'youtube',
      label: '',
    })
  }

  const handleCreateTextLink = () => {
    createLinkMutation.mutateAsync({
      type: 'text-link',
      label: 'Title',
      content: '',
      headerPosition: 'center',
    })
  }

  return (
    <>
      {!addLink ? (
        <>
          <div
            className=' flex h-12 w-full cursor-pointer items-center justify-center gap-x-2 rounded-full bg-violet-700 px-4 py-2.5 text-white'
            onClick={() => setAddLink(!addLink)}
          >
            <LuPlus />
            <p className=' text-sm font-semibold'>Add Link</p>
          </div>
        </>
      ) : (
        <div className=' overflow-hidden rounded-[24px] bg-white'>
          <div className=' flex flex-col py-6'>
            <div className=' px-6'>
              <div className=' flex justify-between'>
                <h1 className=' font-medium text-gray-800'>Enter URL</h1>
                <div
                  onClick={() => setAddLink(!addLink)}
                  className=' cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                >
                  <HiX size={20} />
                </div>
              </div>
              <div className='mt-2 flex gap-x-4'>
                <Input
                  label='URL'
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  className={cn(
                    ' rounded-full bg-violet-700 px-8 text-sm text-white disabled:bg-neutral-300 disabled:text-neutral-400'
                  )}
                  disabled={!isValidUrl(url)}
                  onClick={handleCreateLink}
                >
                  Add
                </button>
              </div>
            </div>
            <hr className=' my-6' />

            <div className=' px-6'>
              <div className=' flex justify-between text-sm'>
                <p className=' font-medium text-gray-800'>
                  Inspired by your interest
                </p>
                <div
                  className='flex cursor-pointer items-center gap-x-1 text-violet-700 hover:underline '
                  onClick={() => setDisplayDialog(!displayDialog)}
                >
                  <p className='   '>Show all</p>
                  <HiChevronDoubleRight />
                </div>
              </div>
              <div className='mt-4 overflow-x-scroll [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                <div className=' flex gap-4'>
                  <button
                    className=' flex cursor-pointer flex-col items-center gap-y-1'
                    onClick={handleCreateHeader}
                  >
                    <div className=' flex h-[88px] w-[88px] items-center justify-center rounded-[24px] bg-gray-100'>
                      <svg
                        width='40'
                        height='40'
                        viewBox='0 0 40 40'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M0 8C0 3.58172 3.58172 0 8 0H32C36.4183 0 40 3.58172 40 8V32C40 36.4183 36.4183 40 32 40H8C3.58172 40 0 36.4183 0 32V8Z'
                          fill='#C2C9D1'
                        ></path>
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M12.5 12.75H27.5C28.25 12.75 28.9167 13.4166 28.9167 14.1666C28.9167 14.9166 28.25 15.5833 27.5 15.5833H12.5C11.75 15.5833 11.0833 14.9166 11.0833 14.1666C11.0833 13.4166 11.75 12.75 12.5 12.75ZM10 14.1666C10 12.75 11.0833 11.6666 12.5 11.6666H27.5C28.9167 11.6666 30 12.75 30 14.1666C30 15.5833 28.9167 16.6666 27.5 16.6666H12.5C11.0833 16.6666 10 15.5833 10 14.1666ZM12.5 24.4166H27.5C28.25 24.4166 28.9167 25.0833 28.9167 25.8333C28.9167 26.5833 28.25 27.25 27.5 27.25H12.5C11.75 27.25 11.0833 26.5833 11.0833 25.8333C11.0833 25.0833 11.75 24.4166 12.5 24.4166ZM10 25.8333C10 24.4166 11.0833 23.3333 12.5 23.3333H27.5C28.9167 23.3333 30 24.4166 30 25.8333C30 27.25 28.9167 28.3333 27.5 28.3333H12.5C11.0833 28.3333 10 27.25 10 25.8333ZM15.25 20.0833C15.25 20.5833 14.8333 21.0833 14.25 21.0833C13.6667 21.0833 13.3333 20.6666 13.3333 20.0833C13.3333 19.5833 13.75 19.1666 14.3333 19.1666C14.9167 19.1666 15.25 19.5833 15.25 20.0833ZM17.9167 21.0833C18.4167 21.0833 18.9167 20.6666 18.9167 20.0833C18.9167 19.5833 18.5 19.1666 17.9167 19.1666C17.4167 19.1666 17 19.5833 17 20.0833C16.9167 20.6666 17.3333 21.0833 17.9167 21.0833ZM22.4167 20.0833C22.4167 20.5833 22 21.0833 21.5 21.0833C21 21.0833 20.5 20.6666 20.5 20.0833C20.5 19.5833 20.9167 19.1666 21.5 19.1666C22 19.1666 22.4167 19.5833 22.4167 20.0833ZM25.0833 21.0833C25.5833 21.0833 26 20.6666 26 20.0833C26 19.5833 25.5833 19.1666 25.0833 19.1666C24.5833 19.1666 24.1667 19.5833 24.1667 20.0833C24.0833 20.6666 24.5 21.0833 25.0833 21.0833Z'
                          fill='#111821'
                        ></path>
                      </svg>
                    </div>
                    <p className=' text-xs font-medium text-gray-800'>Header</p>
                  </button>
                  <button
                    onClick={handleCreateLinkYoutube}
                    className=' flex flex-col items-center gap-y-1'
                  >
                    <div className=' flex h-[88px] w-[88px] items-center justify-center rounded-[24px] bg-gray-100'>
                      <div className=' flex h-10  w-10 items-center justify-center rounded-lg bg-white'>
                        <SiYoutube className=' fill-red-500' size={24} />
                      </div>
                    </div>
                    <p className=' text-xs font-medium text-gray-800'>
                      YouTube
                    </p>
                  </button>
                  <button
                    onClick={handleCreateTextLink}
                    className=' flex flex-col items-center gap-y-1'
                  >
                    <div className=' flex h-[88px] w-[88px] items-center justify-center rounded-[24px] bg-gray-100'>
                      <div className=' flex h-10  w-10 items-center justify-center rounded-lg bg-white'>
                        <p className=' text-xs underline'>abc</p>
                      </div>
                    </div>
                    <p className=' text-xs font-medium text-gray-800'>
                      Text Link
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {displayDialog ? (
        <div className=' fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur transition-all sm:items-center sm:p-4'>
          <div
            className=' fixed inset-0 z-50'
            onClick={() => setDisplayDialog(!displayDialog)}
          ></div>
          <div className={cn('fixed z-50 w-full max-w-5xl p-0 sm:p-4')}>
            <div className=' translate mx-auto h-auto w-full overflow-y-auto rounded-t-lg bg-white transition-all duration-300 sm:rounded-[24px]'>
              {/* Header */}
              <div className=' relative border-b p-6'>
                <div className=' text-center'>
                  <p className=' font-semibold'>Add to hyprr.link</p>
                </div>
                <div className=' absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-100'>
                  <HiX className=' ' size={20} />
                </div>
              </div>
              <div className=' max-h-[500px] overflow-y-auto'>
                <div className=' h-[1000px]'></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
