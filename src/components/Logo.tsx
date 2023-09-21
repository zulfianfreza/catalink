import React from 'react'
import { cn } from '~/lib/utils'
import { poppins } from '~/lib/data/font'
import Link from 'next/link'

export default function Logo({
  className,
  path = '',
}: {
  className?: string
  path?: string
}) {
  return (
    <>
      <Link href={path} className={cn(' flex items-center gap-x-1', className)}>
        <div className=' flex aspect-square w-6 items-center justify-center bg-gray-800 text-white'>
          .C
        </div>
        <p className={cn(' font-medium text-gray-800', poppins.className)}>
          Catalink
        </p>
      </Link>
    </>
  )
}
