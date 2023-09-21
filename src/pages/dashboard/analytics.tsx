import { getSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import ContentContainer from '~/components/ContentContainer'
import { DashboardTemplate } from '~/components/template'
import { prisma } from '~/lib/db'
import { trpc } from '~/lib/trpc'
import { extractColors, extractColorsFromSrc } from 'extract-colors'
import getPixels from 'get-pixels'

export default function AnalyticsPage() {
  const { data } = trpc.site.getAnalytics.useQuery()

  getPixels('/images/avatar.png', (err, pixels) => {
    if (!err) {
      const data = [...pixels.data]
      const width = Math.round(Math.sqrt(data.length / 4))
      const height = width

      extractColors({ data, width, height })
        .then(console.log)
        .catch(console.log)
    }
  })

  return (
    <DashboardTemplate>
      <NextSeo title='Analytics - Circle' />
      <ContentContainer>
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
