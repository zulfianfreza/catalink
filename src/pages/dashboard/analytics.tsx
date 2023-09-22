import { getSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import ContentContainer from '~/components/ContentContainer'
import { DashboardTemplate } from '~/components/template'
import { prisma } from '~/lib/db'
import { trpc } from '~/lib/trpc'

export default function AnalyticsPage() {
  const { data, isLoading } = trpc.site.getAnalytics.useQuery()

  return (
    <DashboardTemplate>
      <NextSeo title='Analytics - Circle' />
      <ContentContainer>
        {isLoading ? (
          <div className=' flex h-full w-full flex-col items-center justify-center gap-y-4'>
            <svg
              className='-ml-1 mr-3 h-5 w-5 animate-spin text-violet-700'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx={12}
                cy={12}
                r={10}
                stroke='currentColor'
                strokeWidth={4}
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          </div>
        ) : (
          <div className=' w-full rounded-[24px] bg-white p-6 py-10'>
            <div className=' text-center'>
              <h1 className=' text-lg font-medium'>
                Lifetime Analytics <br />
              </h1>
            </div>
            <div className=' mt-4 flex justify-between'>
              <div className='flex flex-1 flex-col items-center justify-center'>
                <div className='flex items-center gap-x-1'>
                  <div className=' h-2 w-2 rounded-full bg-green-500'></div>
                  <p className=' text-xs'>Views:</p>
                </div>
                <h1 className=' text-lg'>{data?.views}</h1>
              </div>
              <div className='flex flex-1 flex-col items-center justify-center'>
                <div className='flex items-center gap-x-1'>
                  <div className=' h-2 w-2 rounded-full bg-violet-500'></div>
                  <p className=' text-xs'>Click:</p>
                </div>
                <h1 className=' text-lg'>{data?.click}</h1>
              </div>
              <div className='flex flex-1 flex-col items-center justify-center'>
                <div className='flex items-center gap-x-1'>
                  <div className=' h-2 w-2 rounded-full bg-sky-500'></div>
                  <p className=' text-xs'>CTR:</p>
                </div>
                <h1 className=' text-lg'>{data?.ctr.toFixed(2)}%</h1>
              </div>
            </div>
          </div>
        )}
      </ContentContainer>
    </DashboardTemplate>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  })

  if (user?.username == null || !user?.username) {
    return {
      redirect: {
        destination: '/information',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
