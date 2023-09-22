import { getSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import ContentContainer from '~/components/ContentContainer'
import Loading from '~/components/Loading'
import Logo from '~/components/Logo'
import { TabButtons, TabFonts, TabProfile, TabThemes } from '~/components/tab'
import { DashboardTemplate } from '~/components/template'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useProfile from '~/hooks/useProfile'
import useSite from '~/hooks/useSite'
import useTheme from '~/hooks/useTheme'
import { TABS } from '~/lib/data/constants'
import { prisma } from '~/lib/db'

export default function AppearancePage() {
  const {
    data: dataUser,
    hotReloadIframe: refetchUser,
    isLoading: isLoadingUser,
  } = useProfile()
  const {
    data: dataTheme,
    hotReloadIframe: refetchTheme,
    isLoading: isLoadingTheme,
  } = useTheme()

  const {
    data: dataSite,
    hotReloadIframe: refetchSite,
    isLoading: isLoadingSite,
  } = useSite()

  return (
    <DashboardTemplate>
      <NextSeo title='Appearance - Circle' />
      <ContentContainer>
        <Tabs defaultValue='profile' className=' h-full w-full'>
          <TabsList className='flex h-fit justify-between overflow-x-scroll rounded-full bg-white [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {TABS.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className=' flex-1 rounded-full px-4 py-2.5 font-medium hover:bg-violet-700 hover:text-white data-[state=active]:bg-violet-700 data-[state=active]:text-white'
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {isLoadingSite ? (
            <div className=' flex h-full w-full items-center justify-center'>
              <Loading />
            </div>
          ) : (
            <TabsContent value='profile'>
              <TabProfile
                refetch={refetchSite}
                profile={dataSite}
                user={dataUser}
              />
            </TabsContent>
          )}
          {isLoadingTheme ? (
            <div className=' flex h-full w-full items-center justify-center'>
              <Loading />
            </div>
          ) : (
            <TabsContent value='themes'>
              <TabThemes theme={dataTheme} refetch={refetchTheme} />
            </TabsContent>
          )}
          {isLoadingTheme ? (
            <div className=' flex h-full w-full items-center justify-center'>
              <Loading />
            </div>
          ) : (
            <TabsContent value='buttons'>
              <TabButtons theme={dataTheme} refetch={refetchTheme} />
            </TabsContent>
          )}
          {isLoadingTheme ? (
            <div className=' flex h-full w-full items-center justify-center'>
              <Loading />
            </div>
          ) : (
            <TabsContent value='fonts'>
              <TabFonts theme={dataTheme} refetch={refetchTheme} />
            </TabsContent>
          )}
        </Tabs>
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
