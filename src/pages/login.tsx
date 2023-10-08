import React from 'react'
import { Input } from '~/components/ui/input'
import { getSession, signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import Image from 'next/image'
import Logo from '~/components/Logo'

export default function LoginPage() {
  return (
    <div className=' relative flex min-h-screen w-full bg-white'>
      <div className=' flex-1'>
        <div className=' relative flex h-screen w-full items-center  justify-center p-8 lg:p-10'>
          <Logo className=' absolute left-5 top-5 lg:left-8 lg:top-8' />
          <div className=' flex w-full max-w-xl flex-col justify-center'>
            <div className=' text-center'>
              <h1 className=' text-[36px] font-bold'>Welcome Back</h1>
              <p className='  text-gray-500'>Login to your Catalink</p>
            </div>
            <div className=' mt-16 flex flex-col items-center gap-y-2'>
              <button
                className=' flex h-12 w-full cursor-pointer items-center justify-center gap-x-2 rounded-full border border-gray-200 text-sm transition-all hover:bg-gray-100 '
                onClick={(e) => {
                  e.preventDefault()
                  signIn('google', {
                    callbackUrl: '/dashboard',
                    viewCount: 0,
                  })
                }}
              >
                <FcGoogle size={24} />
                <p>Continue with Google</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='right-0 top-0 hidden h-screen items-center justify-center bg-indigo-200 lg:flex lg:w-[408] xl:w-[482px]'>
        <div className=' relative aspect-square w-[450px]'>
          <Image
            src='/images/thumbnail-hero.png'
            fill
            alt='hero'
            className=' object-contain'
          />
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
