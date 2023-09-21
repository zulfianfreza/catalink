import { Site, User } from '@prisma/client'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Avatar from '~/components/Avatar'
import { Input } from '~/components/ui/input'
import { deleteImageCloudinary } from '~/hooks/useHandleDeleteImage'
import { config } from '~/lib/config'
import { trpc } from '~/lib/trpc'
import { cn } from '~/lib/utils'

interface TabProfileProps {
  profile: Site | null | undefined
  refetch: () => void
  user: User | null | undefined
}

export function TabProfile({ profile, refetch, user }: TabProfileProps) {
  const [profileTitle, setProfileTitle] = useState(profile?.profileTitle ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [error, setError] = useState({
    profileTitle: '',
    profileImage: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateProfileMutation = trpc.site.updateSiteProfile.useMutation({
    onSuccess: () => {
      toast.success('success')
      refetch()
    },
  })

  const handleUpdate = (profileImage?: any) => {
    updateProfileMutation.mutateAsync({
      bio,
      profileTitle,
      profileImage,
    })
  }

  const handleUpdateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 2e6) {
        setError({
          ...error,
          profileImage: 'Please upload a file smaller than 2 MB',
        })
        return false
      }
      file = e.target.files[0]
      setError({ ...error, profileImage: '' })
    }

    const formData = new FormData()
    formData.append('file', file!)
    formData.append('upload_preset', config.cloudinaryUploadPreset)

    try {
      setIsLoading(true)
      if (profile?.profileImage !== '') {
        await deleteImageCloudinary(profile?.profileImage ?? '')
      }
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
        formData
      )
      console.log(response)
      handleUpdate(response.data.secure_url)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async () => {
    await deleteImageCloudinary(profile?.profileImage ?? '')
    handleUpdate('')
  }

  const onBlur = () => {
    if (profile?.profileTitle == profileTitle && profile?.bio == bio) return
    if (profileTitle == '') {
      setError({ ...error, profileTitle: 'Please enter a Profile Title' })
      return
    }
    setError({ ...error, profileTitle: '' })
    handleUpdate()
  }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className=' mt-8'>
      <div className=''>
        <h1 className=' text-lg font-semibold text-gray-800'>Profile</h1>
      </div>
      <div className=' mt-2 rounded-[24px] bg-white p-6'>
        <div className='flex gap-x-4'>
          {/* <div className=' h-24 w-24 rounded-full bg-gray-900'></div> */}
          <Avatar
            src={profile?.profileImage ?? user?.image}
            className=' h-24 w-24'
          />
          <div className=' flex flex-1 flex-col gap-y-2'>
            <input
              type='file'
              name=''
              id='profileImage'
              className='hidden'
              onChange={handleUpdateImage}
              ref={inputRef}
              accept='image/png, image/jpg, image/jpeg'
            />
            <div className=''>
              <button
                disabled={isLoading}
                onClick={handleClick}
                className=' flex h-12 w-full items-center justify-center rounded-full bg-violet-700 text-sm font-semibold text-white hover:bg-violet-800 disabled:bg-violet-400'
              >
                {isLoading ? (
                  <>
                    <svg
                      className='-ml-1 mr-3 h-5 w-5 animate-spin text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx={12}
                        cy={12}
                        r={10}
                        stroke='currentColor'
                        strokeWidth={4}
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    <p>Uploading</p>
                  </>
                ) : (
                  <p>Choose an image</p>
                )}
              </button>
              {error.profileImage != '' && (
                <p className=' mt-1 text-xs text-red-700'>
                  {error.profileImage}
                </p>
              )}
            </div>
            <button
              onClick={handleDeleteImage}
              className=' flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-200'
            >
              <p>Remove</p>
            </button>
          </div>
        </div>
        <div className=' mt-4 flex flex-col gap-y-2'>
          <div className=''>
            <Input
              label='Profile Title'
              value={profileTitle}
              onChange={(e) => setProfileTitle(e.target.value)}
              onBlur={onBlur}
            />
            {error.profileTitle != '' && (
              <p className=' mt-1 text-xs text-red-700'>{error.profileTitle}</p>
            )}
          </div>
          <div className=' relative w-full'>
            <textarea
              value={bio}
              onBlur={onBlur}
              onChange={(e) => setBio(e.target.value)}
              placeholder=' '
              className={cn(
                'peer h-24 w-full rounded-lg bg-gray-100 p-2 pl-4 pt-6 text-sm outline-none transition hover:ring-2 hover:ring-gray-200 focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-70'
              )}
            ></textarea>
            <label
              className={cn(
                'absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-[0.85] transform truncate text-sm text-gray-500 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-[0.85]'
              )}
            >
              Bio
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
