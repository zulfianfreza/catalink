import { Theme } from '@prisma/client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { trpc } from '~/lib/trpc'
import { BUTTON_TYPE } from '~/types/theme'
import ButtonTheme from '../ButtonTheme'
import ColorPicker from '../ColorPicker'
// import { refetchTheme } from '@/lib/hotReloadIframe'

interface TabButtonProps {
  theme: Theme | null | undefined
  refetch: () => void
}

export function TabButtons({ theme, refetch }: TabButtonProps) {
  const [buttonType, setButtonType] = useState(
    theme?.buttonType ?? BUTTON_TYPE.HARDSHADOW
  )
  const [buttonColor, setButtonColor] = useState(
    theme?.buttonColor ?? '#ffffff'
  )
  const [shadowColor, setShadowColor] = useState(
    theme?.shadowColor ?? '#000000'
  )
  const [buttonFontColor, setButtonFontColor] = useState(
    theme?.buttonFontColor ?? '#000000'
  )

  const updateThemeMutation = trpc.theme.updateTheme.useMutation({
    onSuccess: () => {
      refetch()
      toast.success('success')
      refetch()
    },
  })

  const handleUpdate = (buttonType?: string) => {
    updateThemeMutation.mutateAsync({
      buttonType,
      buttonColor,
      buttonFontColor,
      shadowColor,
    })
  }

  const handleUpdateButtonType = (buttonType: string) => {
    if (theme?.buttonType == buttonType) return
    handleUpdate(buttonType)
    setButtonType(buttonType)
  }

  const onBlur = () => {
    handleUpdate()
  }

  return (
    <>
      <div className=' mt-8'>
        <div className=''>
          <h1 className=' text-lg font-semibold text-gray-900'>Buttons</h1>
        </div>
        <div className=' mt-2 rounded-[24px] bg-white p-6'>
          <div className=''>
            <p className=' text-sm text-gray-700'>Fill</p>
            <div className=' mt-2 flex items-center justify-between gap-x-6'>
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.FILL}
                type={BUTTON_TYPE.FILL}
                onClick={() => handleUpdateButtonType(BUTTON_TYPE.FILL)}
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.FILLROUNDED}
                type={BUTTON_TYPE.FILLROUNDED}
                onClick={() => handleUpdateButtonType(BUTTON_TYPE.FILLROUNDED)}
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.FILLROUNDEDFULL}
                type={BUTTON_TYPE.FILLROUNDEDFULL}
                onClick={() =>
                  handleUpdateButtonType(BUTTON_TYPE.FILLROUNDEDFULL)
                }
              />
            </div>
          </div>
          <div className=' mt-8'>
            <p className=' text-sm text-gray-700'>Outline</p>
            <div className=' mt-2 flex justify-between gap-x-6'>
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.OUTLINE}
                type={BUTTON_TYPE.OUTLINE}
                onClick={() => handleUpdateButtonType(BUTTON_TYPE.OUTLINE)}
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.OUTLINEROUNDED}
                type={BUTTON_TYPE.OUTLINEROUNDED}
                onClick={() =>
                  handleUpdateButtonType(BUTTON_TYPE.OUTLINEROUNDED)
                }
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.OUTLINEROUNDEDFULL}
                type={BUTTON_TYPE.OUTLINEROUNDEDFULL}
                onClick={() =>
                  handleUpdateButtonType(BUTTON_TYPE.OUTLINEROUNDEDFULL)
                }
              />
            </div>
          </div>
          <div className=' mt-8'>
            <p className=' text-sm text-gray-700'>Soft Shadow</p>
            <div className=' mt-2 flex justify-between gap-x-6'>
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.SOFTSHADOW}
                type={BUTTON_TYPE.SOFTSHADOW}
                onClick={() => handleUpdateButtonType(BUTTON_TYPE.SOFTSHADOW)}
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.SOFTSHADOWROUNDED}
                type={BUTTON_TYPE.SOFTSHADOWROUNDED}
                onClick={() =>
                  handleUpdateButtonType(BUTTON_TYPE.SOFTSHADOWROUNDED)
                }
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.SOFTSHADOWROUNDEDFULL}
                type={BUTTON_TYPE.SOFTSHADOWROUNDEDFULL}
                onClick={() =>
                  handleUpdateButtonType(BUTTON_TYPE.SOFTSHADOWROUNDEDFULL)
                }
              />
            </div>
          </div>
          <div className=' mt-8'>
            <p className=' text-sm text-gray-700'>Hard Shadow</p>
            <div className=' mt-4 flex justify-between gap-x-6'>
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.HARDSHADOW}
                type={BUTTON_TYPE.HARDSHADOW}
                onClick={() => handleUpdateButtonType(BUTTON_TYPE.HARDSHADOW)}
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.HARDSHADOWROUNDED}
                type={BUTTON_TYPE.HARDSHADOWROUNDED}
                onClick={() =>
                  handleUpdateButtonType(BUTTON_TYPE.HARDSHADOWROUNDED)
                }
              />
              <ButtonTheme
                active={buttonType === BUTTON_TYPE.HARDSHADOWROUNDEDFULL}
                type={BUTTON_TYPE.HARDSHADOWROUNDEDFULL}
                onClick={() =>
                  handleUpdateButtonType(BUTTON_TYPE.HARDSHADOWROUNDEDFULL)
                }
              />
            </div>
          </div>
          <ColorPicker
            label='Button Color'
            value={buttonColor}
            setColor={(color) => setButtonColor(color)}
            onBlur={onBlur}
          />
          <ColorPicker
            label='Button Font Color'
            value={buttonFontColor}
            setColor={(color) => setButtonFontColor(color)}
            onBlur={onBlur}
          />
          {buttonType === BUTTON_TYPE.HARDSHADOW ||
          buttonType === BUTTON_TYPE.HARDSHADOWROUNDED ||
          buttonType === BUTTON_TYPE.HARDSHADOWROUNDEDFULL ? (
            <ColorPicker
              label='Shadow Color'
              value={shadowColor}
              setColor={(color) => setShadowColor(color)}
              onBlur={onBlur}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}
