import Image from 'next/image'
import React from 'react'

export default function thumbnail() {
  return (
    <div className=' relative aspect-video w-full overflow-hidden'>
      <Image
        src='/images/code.png'
        alt=''
        fill
        className=' object-cover object-top'
      />
      <div className=' absolute h-full w-full bg-gradient-to-r from-black/50 to-green-900'>
        <div className=' relative h-full w-full '>
          <div className=' flex h-full flex-col justify-center p-10'>
            <p className=' text-[128px] font-bold leading-tight tracking-tighter text-white'>
              <span className=' text-[#44e660]'>Linktree</span> Clone <br />
              Using T3 Stack
            </p>
            <div className=' absolute bottom-10 flex gap-4'>
              <div className=' relative aspect-square h-20'>
                <Image
                  src='/images/nextjs.png'
                  fill
                  alt=''
                  className=' object-contain'
                />
              </div>
              <div className=' relative aspect-square h-20'>
                <Image
                  src='/images/ts.png'
                  fill
                  alt=''
                  className=' object-contain'
                />
              </div>
              <div className=' relative aspect-square h-20'>
                <Image
                  src='/images/tailwind.png'
                  fill
                  alt=''
                  className=' object-contain'
                />
              </div>
              <div className=' relative aspect-square h-20'>
                <Image
                  src='/images/trpc.png'
                  fill
                  alt=''
                  className=' object-contain'
                />
              </div>
              <div className=' relative aspect-square h-20'>
                <Image
                  src='/images/mongo.png'
                  fill
                  alt=''
                  className=' object-contain'
                />
              </div>
            </div>
          </div>
          <div className=' absolute right-14 top-1/2 -translate-y-1/2'>
            <div className=' relative aspect-[1/2] w-[352px] overflow-hidden rounded-[36px]'>
              <Image
                src='/images/example.png'
                fill
                alt=''
                className=' object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
