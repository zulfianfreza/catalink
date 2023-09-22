import { Theme } from '@prisma/client'
import axios from 'axios'
import { Balsamiq_Sans } from 'next/font/google'
import React, { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { deleteImageCloudinary } from '~/hooks/useHandleDeleteImage'
import { trpc } from '~/lib/trpc'
import { cn } from '~/lib/utils'
import { BACKGROUND_TYPE } from '~/types/theme'
import ColorPicker from '../ColorPicker'
import { config } from '~/lib/config'
import usePreviewLoading from '~/hooks/usePreviewLoading'

const balsamiqSans = Balsamiq_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
})

interface TabThemesProps {
  theme: Theme | null | undefined
  refetch: () => void
}

export function TabThemes({ theme, refetch }: TabThemesProps) {
  const [backgroundPrimary, setBackgroundPrimary] = useState(
    theme?.backgroundPrimary ?? '#ffffff'
  )
  const [backgroundSecondary, setBackgroundSecondary] = useState(
    theme?.backgroundSecondary ?? '#ffffff'
  )
  const [backgroundImage, setBackgroundImage] = useState(
    theme?.backgroundImage ?? ''
  )
  const [backgroundType, setBackgroundType] = useState(
    theme?.backgroundType ?? BACKGROUND_TYPE.SOLID
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // React.useEffect(() => {
  //   setBackgroundType(theme?.backgroundType ?? BACKGROUND_TYPE.SOLID)
  // })

  const previewLoading = usePreviewLoading()

  const updateThemeMutation = trpc.theme.updateTheme.useMutation({
    onMutate: () => {
      previewLoading.setIsLoading(true)
    },
    onSuccess: () => {
      previewLoading.setIsLoading(false)
      toast.success('success')
      refetch()
    },
  })

  const handleUpdate = ({
    backgroundType,
    backgroundImage,
  }: {
    backgroundType?: string
    backgroundImage?: string
  }) => {
    updateThemeMutation.mutateAsync({
      backgroundType,
      backgroundPrimary,
      backgroundSecondary,
      backgroundImage,
    })
  }

  const handleUpdateBgType = async (type: BACKGROUND_TYPE) => {
    if (theme?.backgroundType == type) return
    handleUpdate({ backgroundType: type })
    setBackgroundType(type)
  }

  const onBlur = async () => {
    handleUpdate({})
  }

  const setColorPrimary = (color: string) => {
    setBackgroundPrimary(color)
  }

  const setColorSecondary = (color: string) => {
    setBackgroundSecondary(color)
  }

  const handleClickScroll = () => {
    const element = document.getElementById('background-section')
    const headerOffset = 90
    const elementPosition = element?.getBoundingClientRect().top
    const offsetPosition = elementPosition! + window.pageYOffset - headerOffset
    if (element) {
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file: File
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 2e6) {
        setError('Please upload a file smaller than 5 MB')
        return false
      }
      setError('')
      file = e.target.files[0]
    }

    const formData = new FormData()
    formData.append('file', file!)
    formData.append('upload_preset', config.cloudinaryUploadPreset)

    try {
      setIsLoading(true)
      previewLoading.setIsLoading(true)
      if (theme?.backgroundImage !== '') {
        await deleteImageCloudinary(theme?.backgroundImage ?? '')
      }
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
        formData
      )
      console.log(response)
      handleUpdate({ backgroundImage: response.data.secure_url })
    } catch (error) {
      toast.error(JSON.stringify(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <>
      <div className=' mt-8'>
        <div className=''>
          <h1 className=' text-lg font-semibold text-gray-900'>Themes</h1>
        </div>
        <div className=' mt-2 rounded-[24px] bg-white p-6'>
          <div className='grid grid-cols-4 gap-6 md:grid-cols-3 lg:grid-cols-4'>
            <button
              className='flex flex-col items-center justify-center gap-y-2'
              onClick={handleClickScroll}
            >
              <div className=' flex aspect-[10/16] w-full items-center justify-center rounded-xl border-[1.5px] border-dashed border-black text-center uppercase'>
                <p className=' text-lg'>
                  Create <br />
                  Your <br />
                  Own
                </p>
              </div>
              <p className=' text-sm text-gray-700'>Custom</p>
            </button>
            <div
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-y-2'
              )}
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.WIREFRAME)}
            >
              <div
                className={cn(
                  ' aspect-[10/16] w-full',
                  balsamiqSans.className,
                  {
                    'rounded-xl p-2 ring-2 ring-violet-300':
                      backgroundType == BACKGROUND_TYPE.WIREFRAME,
                  }
                )}
              >
                <div className=' h-full w-full rounded-lg border border-gray-200 bg-white '>
                  <div className=' flex h-full flex-col justify-center gap-y-2 p-4'>
                    <div className=' flex h-4 w-full items-center justify-center border border-black shadow-[2px_2px_0_0_#000000]'>
                      <p className={' text-[8px]'}>Link</p>
                    </div>
                    <div className=' flex h-4 w-full items-center justify-center border border-black shadow-[2px_2px_0_0_#000000]'>
                      <p className={' text-[8px]'}>Link</p>
                    </div>
                    <div className=' flex h-4 w-full items-center justify-center border border-black shadow-[2px_2px_0_0_#000000]'>
                      <p className={' text-[8px]'}>Link</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className=' text-sm text-gray-700'>Wireframe</p>
            </div>
            <div
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-y-2'
              )}
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.MINERAL_BLUE)}
            >
              <div
                className={cn(
                  ' aspect-[10/16] w-full',
                  balsamiqSans.className,
                  {
                    'rounded-xl p-2 ring-2 ring-violet-300':
                      backgroundType == BACKGROUND_TYPE.MINERAL_BLUE,
                  }
                )}
              >
                <div className=' h-full w-full rounded-lg border border-gray-200 bg-[#e0f6ff] '>
                  <div className=' flex h-full flex-col justify-center gap-y-2 p-4'>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                  </div>
                </div>
              </div>
              <p className=' text-sm text-gray-700'>Mineral Blue</p>
            </div>
            <div
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-y-2'
              )}
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.MINERAL_GREEN)}
            >
              <div
                className={cn(
                  ' aspect-[10/16] w-full',
                  balsamiqSans.className,
                  {
                    'rounded-xl p-2 ring-2 ring-violet-300':
                      backgroundType == BACKGROUND_TYPE.MINERAL_GREEN,
                  }
                )}
              >
                <div className=' h-full w-full rounded-lg border border-gray-200 bg-[#e0faee] '>
                  <div className=' flex h-full flex-col justify-center gap-y-2 p-4'>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                  </div>
                </div>
              </div>
              <p className=' text-sm text-gray-700'>Mineral Green</p>
            </div>
            <div
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-y-2'
              )}
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.MINERAL_ORANGE)}
            >
              <div
                className={cn(
                  ' aspect-[10/16] w-full',
                  balsamiqSans.className,
                  {
                    'rounded-xl p-2 ring-2 ring-violet-300':
                      backgroundType == BACKGROUND_TYPE.MINERAL_ORANGE,
                  }
                )}
              >
                <div className=' h-full w-full rounded-lg border border-gray-200 bg-[#ffeee1] '>
                  <div className=' flex h-full flex-col justify-center gap-y-2 p-4'>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                  </div>
                </div>
              </div>
              <p className=' text-sm text-gray-700'>Mineral Orange</p>
            </div>
            <div
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-y-2'
              )}
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.MINERAL_YELLOW)}
            >
              <div
                className={cn(
                  ' aspect-[10/16] w-full',
                  balsamiqSans.className,
                  {
                    'rounded-xl p-2 ring-2 ring-violet-300':
                      backgroundType == BACKGROUND_TYPE.MINERAL_YELLOW,
                  }
                )}
              >
                <div className=' h-full w-full rounded-lg border border-gray-200 bg-[#fff8e0] '>
                  <div className=' flex h-full flex-col justify-center gap-y-2 p-4'>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                    <div className=' h-4 w-full rounded-full border-[1.2px] border-gray-300'></div>
                  </div>
                </div>
              </div>
              <p className=' text-sm text-gray-700'>Mineral Yellow</p>
            </div>
          </div>
        </div>
      </div>
      <div className=' mt-8' id='background-section'>
        <div className=''>
          <h1 className=' text-lg font-semibold text-gray-900'>Backgrounds</h1>
        </div>
        <div className=' mt-2 rounded-[24px] bg-white p-6'>
          <div className='grid grid-cols-4 gap-6 md:grid-cols-3 lg:grid-cols-4'>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.SOLID)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.SOLID,
                })}
              >
                <div className=' h-full w-full rounded-lg bg-gray-300 '></div>
              </div>
              <p className=' text-sm text-gray-700'>Solid</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.GRADIENT)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.GRADIENT,
                })}
              >
                <div className=' h-full w-full rounded-lg bg-gradient-to-tr from-gray-300 to-gray-500  '></div>
              </div>
              <p className=' text-sm text-gray-700'>Gradient</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.IMAGE)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.IMAGE,
                })}
              >
                <div className=' flex h-full w-full items-center justify-center rounded-lg bg-gray-100'>
                  <HiOutlinePhotograph
                    className=' text-gray-800 opacity-50'
                    size={36}
                  />
                </div>
              </div>
              <p className=' text-sm text-gray-700'>Image</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.CUBE)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.CUBE,
                })}
              >
                <div className=' bg-cube aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Cube</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() =>
                handleUpdateBgType(BACKGROUND_TYPE.COLORED_PATTERNS)
              }
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.COLORED_PATTERNS,
                })}
              >
                <div className=' bg-colored-patterns aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Colored Patterns</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.COLORED_SHAPES)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.COLORED_SHAPES,
                })}
              >
                <div className=' bg-colored-shapes aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Colored Shapes</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.HEXAGON)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.HEXAGON,
                })}
              >
                <div className=' bg-hexagon aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Hexagon</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.MOON)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.MOON,
                })}
              >
                <div className=' bg-moon aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Moon</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.SPRINKLE)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.SPRINKLE,
                })}
              >
                <div className=' bg-sprinkle aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Sprinkle</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.CLOUDY)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.CLOUDY,
                })}
              >
                <div className=' bg-cloudy aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Cloudy</p>
            </div>
            <div
              className='flex cursor-pointer flex-col items-center justify-center gap-y-2'
              onClick={() => handleUpdateBgType(BACKGROUND_TYPE.CONTOUR_LINE)}
            >
              <div
                className={cn(' aspect-[10/16] w-full', {
                  'rounded-xl p-2 ring-2 ring-violet-300':
                    backgroundType == BACKGROUND_TYPE.CONTOUR_LINE,
                })}
              >
                <div className=' bg-contour-line aspect-[10/16] h-full w-full rounded-lg bg-cover bg-center'></div>
              </div>
              <p className=' text-sm text-gray-700'>Contour Line</p>
            </div>
          </div>
          {backgroundType == BACKGROUND_TYPE.SOLID ||
          backgroundType == BACKGROUND_TYPE.GRADIENT ? (
            <ColorPicker
              label='Background'
              value={backgroundPrimary}
              onBlur={onBlur}
              setColor={setColorPrimary}
            />
          ) : null}
          {backgroundType == BACKGROUND_TYPE.GRADIENT ? (
            <ColorPicker
              label='Background'
              value={backgroundSecondary}
              onBlur={onBlur}
              setColor={setColorSecondary}
            />
          ) : null}
          {backgroundType == BACKGROUND_TYPE.IMAGE ? (
            <div className=' mt-8 flex flex-col'>
              <p className=' text-sm text-gray-700'>Image</p>
              <div className=' mt-2 self-start'>
                <button
                  // htmlFor='backgroundImage'
                  onClick={handleClick}
                  disabled={isLoading}
                  className=' flex h-10 cursor-pointer items-center justify-center rounded-md bg-violet-700 px-4 text-sm text-white disabled:bg-violet-400'
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
                    <p>
                      {theme?.backgroundImage != ''
                        ? 'Change Image'
                        : 'Upload Image'}
                    </p>
                  )}
                </button>
                {error != '' && (
                  <p className=' mt-1 text-xs text-red-700'>{error}</p>
                )}
                <input
                  type='file'
                  name=''
                  accept='image/png, image/jpg, image/jpeg'
                  ref={inputRef}
                  onChange={handleUploadImage}
                  id='backgroundImage'
                  className=' hidden'
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
