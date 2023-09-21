import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { Input } from './ui/input'

interface ColorPickerProps {
  label: string
  value: string
  onBlur: () => void
  setColor: (value: string) => void
}

export default function ColorPicker({
  label,
  value,
  onBlur,
  setColor,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className=' mt-8'>
      <p className=' text-sm text-gray-700'>{label}</p>

      <div className='relative mt-2 flex gap-x-2'>
        {isOpen ? (
          <>
            <div
              className=' fixed inset-0'
              onClick={() => {
                setIsOpen(!isOpen)
                onBlur()
              }}
            ></div>
            <ChromePicker
              className=' absolute bottom-6 left-6 z-20'
              onChange={(color) => setColor(color.hex)}
              color={value}
            />
          </>
        ) : null}
        <div
          className={` h-12 w-12 cursor-pointer overflow-hidden rounded-lg border`}
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div className=' w-48'>
          <Input
            label={label}
            value={value}
            onBlur={onBlur}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
