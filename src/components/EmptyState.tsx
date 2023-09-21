import React from 'react'
import Logo from './Logo'

export default function EmptyState() {
  return (
    <div className=' flex h-full w-full flex-col items-center justify-center gap-y-4'>
      <Logo className=' opacity-25 grayscale filter' />
      <p className=' text-center font-semibold leading-tight text-gray-400'>
        Show the world who you are. <br />
        Add a link to get started.
      </p>
    </div>
  )
}
