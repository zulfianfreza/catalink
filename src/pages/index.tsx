import { GetServerSideProps } from 'next'
import { User } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import { HiChevronRight } from 'react-icons/hi'
import Logo from '~/components/Logo'
import { useScrollPosition } from '~/hooks/useScrollPosition'
import { cn } from '~/lib/utils'

interface HomeProps {
  user: User
}

export default function Home({ user }: HomeProps) {
  const scroll = useScrollPosition()
  return (
    <>
      <NextSeo title='Catalink' />
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
                <div className=' flex flex-row-reverse items-center gap-x-2'>
                  <Link
                    href='/login'
                    className=' flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-violet-700 to-indigo-700 px-4 text-sm text-white'
                  >
                    Register
                  </Link>
                  <Link
                    href='/login'
                    className=' h-10 rounded-lg bg-gradient-to-r from-violet-700 to-indigo-700 p-[1.5px]'
                  >
                    <div className=' flex h-full w-full items-center justify-center rounded-[6.5px] bg-white px-4 text-sm font-medium text-gray-800 transition hover:bg-transparent hover:bg-opacity-90 hover:text-white '>
                      Login
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=' relative isolate flex h-screen w-full bg-white p-10 pt-20 lg:p-20'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 bottom-20 left-20 -z-10 transform-gpu overflow-hidden leading-none blur-3xl'
          >
            {/* <p className=' bg-gradient-to-r from-violet-500 to-violet-900 bg-clip-text text-[520px] text-transparent opacity-50'>
              Oo
            </p> */}
            {/* <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-700 to-indigo-700 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
            /> */}
          </div>
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
                className=' flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-700 to-indigo-700 px-8 text-sm text-white '
              >
                <p className=' flex items-center gap-x-1'>
                  Try It Now <HiChevronRight size={20} />
                </p>
              </Link>
            </div>
          </div>
          <div className='hidden flex-1 justify-center md:flex'>
            <div className='relative md:w-[350px] lg:w-[450px] xl:w-[500px]'>
              <div className=' absolute aspect-square rounded-full bg-indigo-200 md:bottom-56 md:right-0 md:h-32 lg:bottom-48 lg:h-36 xl:h-48'></div>
              <div className=' absolute aspect-square rounded-full bg-violet-300 md:bottom-32 md:h-32 lg:bottom-16 lg:h-36 xl:h-48'></div>
              <div className=' absolute aspect-square translate-x-1/2 rounded-full bg-indigo-600 md:right-1/2 md:top-24 md:h-32 lg:top-0 lg:top-4 lg:h-36 xl:h-48'></div>
              <div className=' relative h-full w-full'>
                <Image
                  src='/images/thumbnail-hero.png'
                  fill
                  alt=''
                  className=' object-contain'
                />
              </div>
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
