import React from 'react'
import { cn } from '~/lib/utils'
import { poppins } from '~/lib/data/font'
import Link from 'next/link'
import {} from 'next/font/google'

export default function Logo({
  className,
  path = '/',
}: {
  className?: string
  path?: string
}) {
  return (
    <>
      <Link
        href={path}
        className={cn(
          ' flex items-center gap-x-1',
          className,
          poppins.className
        )}
      >
        <div className=' relative flex aspect-square h-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-violet-700 to-indigo-700 p-[2px] leading-[0px] text-white'>
          <div className=' absolute -bottom-3 -right-4 aspect-square h-10 rounded-full border-2 border-white'></div>
          <div className=' absolute -right-4 -top-3 aspect-square h-10 rounded-full border-2 border-white'></div>
        </div>
        <p className={cn(' font-medium text-gray-800')}>Catalink</p>
      </Link>
    </>
  )
}
