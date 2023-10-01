import React from 'react'
import { cn } from '~/lib/utils'
import { poppins } from '~/lib/data/font'
import Link from 'next/link'
import {} from 'next/font/google'

export default function Logo({
  className,
  path = '',
}: {
  className?: string
  path?: string
}) {
  return (
    <>
      <Link
        href={path}
        className={cn(
          ' flex items-center gap-x-[1px]',
          className,
          poppins.className
        )}
      >
        <div className=' flex aspect-square items-center justify-center rounded-[3px] bg-violet-700 p-[2px] leading-[0px] text-white'>
          .C
        </div>
        <p className={cn(' font-medium text-violet-700')}>atalink</p>
      </Link>
    </>
  )
}
