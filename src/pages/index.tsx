import { GetServerSideProps } from 'next'
import { Session, User, getServerSession } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import { HiChevronRight } from 'react-icons/hi'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { SiSnapchat, SiTiktok, SiX } from 'react-icons/si'
import Logo from '~/components/Logo'
import { useScrollPosition } from '~/hooks/useScrollPosition'
import { authOptions } from '~/lib/auth'
import { cn } from '~/lib/utils'

interface HomeProps {
  user: User
}

export default function Home({ user }: HomeProps) {
  const scroll = useScrollPosition()
  return (
    <>
      <NextSeo title='Circle' />
      <div className=' min-h-screen w-full'>
        {/* NAVBAR */}
        <div
          className={cn('fixed top-0 z-50 w-full  p-5 px-10', {
            'bg-white': scroll > 0,
          })}
        >
          <div className='flex items-center justify-between'>
            <div className=''>
              <Logo className='' />
            </div>
            <div className='flex flex-row-reverse items-center gap-x-2'>
              {user ? (
                <div className=' flex flex-row-reverse items-center gap-x-4'>
                  <button
                    onClick={() => signOut()}
                    className=' flex h-12 items-center justify-center rounded-full bg-gray-800 px-8 text-sm text-white'
                  >
                    Logout
                  </button>
                  <Link
                    href='/login'
                    className=' flex items-center justify-center rounded-lg p-1 text-sm text-gray-800 '
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className=' flex flex-row-reverse items-center gap-x-4'>
                  <Link
                    href='/login'
                    className=' flex h-12 items-center justify-center rounded-full bg-violet-700 px-8 text-sm text-white'
                  >
                    Register
                  </Link>
                  <Link
                    href='/login'
                    className=' flex items-center justify-center rounded-lg p-1 text-sm text-gray-800'
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=' flex h-screen w-full bg-gradient-to-b from-violet-100 to-white p-10 pt-20'>
          <div className=' flex flex-1 flex-col justify-center'>
            <div className='flex flex-col'>
              <h1 className=' text-[56px] font-black leading-none text-gray-800 md:text-[56px] lg:text-[72px]'>
                One link to everything.
              </h1>
              <p className=' mt-4 text-gray-500'>
                Catalink is a single link that you can share in your bio or
                social media posts.
              </p>
            </div>
            <div className=' mt-8 flex gap-x-2'>
              {/* <div className=' h-12 w-60 rounded-lg bg-gray-100 transition focus-within:ring-2 focus-within:ring-black hover:focus-within:ring-2 hover:focus-within:ring-black'>
                <div className=' flex h-full items-center'>
                  <label htmlFor='' className=' ml-4 text-sm text-gray-500'>
                    circle.link/
                  </label>
                  <input
                    type='text'
                    className=' h-12 w-full bg-transparent pr-4 text-sm text-gray-500 focus:outline-none'
                    placeholder='username'
                  />
                </div>
              </div> */}
              <Link
                href='/login'
                className=' flex h-12 items-center justify-center rounded-full bg-violet-700 px-8 text-sm text-white '
              >
                <p className=' flex items-center gap-x-1'>
                  Try It Now <HiChevronRight size={20} />
                </p>
              </Link>
            </div>
          </div>
          <div className='hidden flex-1 justify-center md:flex'>
            <div className=' relative md:w-[350px] lg:w-[450px] xl:w-[500px]'>
              <Image
                src='/images/thumbnail-hero.png'
                fill
                alt=''
                className=' object-contain'
              />
            </div>
            {/* <div className=' relative'>
              <div className=' relative aspect-[1/2] w-[320px] scale-90 overflow-hidden rounded-[40px]'>
                <Image
                  src='/images/example.png'
                  fill
                  alt=''
                  className=' object-cover object-top'
                />
              </div>
              <div className=' absolute -right-36 top-16 w-56 rounded-[32px]  bg-gray-800 p-4'>
                <div className=' relative aspect-[4/3] w-full overflow-hidden rounded-[20px]'>
                  <Image
                    src='/images/glasses.png'
                    fill
                    alt=''
                    className=' object-cover'
                  />
                </div>
                <p className=' mt-2 text-center text-sm text-white'>$29</p>
                <button className=' mt-4 flex h-10 w-full items-center justify-center rounded-full bg-white text-sm text-gray-800'>
                  Shop all
                </button>
              </div>

              <div className=' absolute -left-20 bottom-20 flex gap-2'>
                <button className=' flex aspect-square w-[56px] items-center justify-center rounded-full bg-gray-800 text-white'>
                  <SiX size={20} />
                </button>
                <button className=' flex aspect-square w-[56px] items-center justify-center rounded-full bg-gray-800 text-white'>
                  <SiTiktok size={20} />
                </button>
                <button className=' flex aspect-square w-[56px] items-center justify-center rounded-full bg-gray-800 text-white'>
                  <SiSnapchat size={20} />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return {
    props: {
      user: session?.user ?? null,
    },
  }
}
