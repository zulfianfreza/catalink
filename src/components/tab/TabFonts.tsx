import { Dialog, Transition } from '@headlessui/react'
import { Theme } from '@prisma/client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiChevronDown, HiOutlineCheck, HiOutlineX } from 'react-icons/hi'
import useSelectFontModal from '~/hooks/useSelectFontModal'
import { FONT_LIST } from '~/lib/data/font'
import { trpc } from '~/lib/trpc'
import { cn } from '~/lib/utils'
import ColorPicker from '../ColorPicker'
import { Input } from '../ui/input'

interface TabFontsProps {
  theme: Theme | null | undefined
  refetch: () => void
}

export function TabFonts({ theme, refetch }: TabFontsProps) {
  const [fontColor, setFontColor] = useState(theme?.fontColor ?? '#000000')
  const [listFont, setListFont] = useState(FONT_LIST)
  const [searchFont, setSearchFont] = useState('')
  const [selectedFont, setSelectedFont] = useState(
    theme?.fontFamily ?? 'Poppins'
  )

  const selectFontModal = useSelectFontModal()

  const fontFamily = theme?.fontFamily ?? 'Poppins'
  const themeFont = FONT_LIST.find((font) => font.label === fontFamily)

  const handleSearchFont = (e: any) => {
    const text = e.target.value
    if (text != '') {
      let results = [...FONT_LIST]
      results = results.filter((font) => {
        return font.label.toLowerCase().indexOf(text.toLowerCase()) !== -1
      })
      setListFont(results)
    } else {
      setListFont(FONT_LIST)
    }

    setSearchFont(e.target.value)
  }

  const updateThemeMutation = trpc.theme.updateTheme.useMutation({
    onSuccess: () => {
      toast.success('success')
      setSearchFont('')
      setSelectedFont(theme?.fontFamily ?? 'Poppins')
      refetch()
    },
  })

  const handleUpdate = () => {
    updateThemeMutation.mutateAsync({ fontColor, fontFamily: selectedFont })
  }

  const handleUpdateFont = () => {
    handleUpdate()
    selectFontModal.onClose()
  }

  const setColor = (value: string) => {
    setFontColor(value)
  }

  const onBlurColor = async () => {
    handleUpdate()
    setSelectedFont('')
  }

  const handleClose = () => {
    selectFontModal.onClose()
    setSearchFont('')
    setSelectedFont(theme?.fontFamily ?? 'Poppins')
  }

  return (
    <>
      <div className=' mt-8'>
        <div className=''>
          <h1 className=' text-lg font-semibold text-gray-900'>Fonts</h1>
        </div>
        <div className=' mt-2 rounded-[24px] bg-white p-6'>
          <div className=''>
            <p className=' text-sm text-gray-700'>Font</p>
            <div className='mt-2 flex gap-x-2'>
              <div className=' flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 '>
                <p className={themeFont?.value.className}>Aa</p>
              </div>
              <div
                className=' flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border px-4'
                onClick={selectFontModal.onOpen}
              >
                <p className=' text-sm'>{fontFamily!}</p>
                <HiChevronDown size={16} />
              </div>
            </div>
          </div>
          <ColorPicker
            label='Color'
            value={fontColor}
            setColor={setColor}
            onBlur={onBlurColor}
          />
        </div>
      </div>
      <Transition appear show={selectFontModal.isOpen} as={React.Fragment}>
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
                    <div className=' text-center'>
                      <p className=' font-semibold'>Select Font</p>
                    </div>
                    <div
                      className=' absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-100'
                      onClick={handleClose}
                    >
                      <HiOutlineX className=' ' size={20} />
                    </div>
                  </div>
                  <div className=' px-5 pb-2'>
                    <Input
                      label='Search by font name'
                      value={searchFont}
                      onChange={handleSearchFont}
                    />
                  </div>
                  <div className=' max-h-[240px] min-h-[240px] overflow-y-auto px-5'>
                    {listFont.map((font, index) => (
                      <button
                        key={index}
                        className={cn(
                          ' flex h-12 w-full cursor-pointer items-center justify-between rounded-full px-6 hover:bg-gray-100',
                          {
                            ' bg-violet-200 hover:bg-violet-200':
                              font.label === selectedFont,
                          }
                        )}
                        onClick={() => setSelectedFont(font.label)}
                      >
                        <p className={font.value.className}>{font.label}</p>
                        {font.label === selectedFont ? (
                          <p className=' flex items-center gap-x-2 text-sm font-light'>
                            <HiOutlineCheck size={20} /> Selected
                          </p>
                        ) : null}
                      </button>
                    ))}
                  </div>
                  <div className=' p-5'>
                    <button
                      onClick={handleUpdateFont}
                      disabled={Object.keys(selectedFont).length === 0}
                      className=' flex h-12 w-full items-center justify-center rounded-full bg-violet-700 font-semibold text-white disabled:bg-neutral-300 disabled:text-neutral-400'
                    >
                      <p className=' '>Save</p>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
