import { getSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import React from 'react'
import { toast } from 'react-hot-toast'
import { IconType } from 'react-icons'
import { HiEmojiHappy } from 'react-icons/hi'
import { LuSearch } from 'react-icons/lu'
import ContentContainer from '~/components/ContentContainer'
import Logo from '~/components/Logo'
import CardSeo from '~/components/card/CardSeo'
import CardSocialIcon from '~/components/card/CardSocialIcon'
import ModalAddSocialIcon from '~/components/modal/ModalAddSocialIcon'
import ModalEditSocialIcon from '~/components/modal/ModalEditSocialIcon'
import { DashboardTemplate } from '~/components/template'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import useSite from '~/hooks/useSite'
import useSocialIcon from '~/hooks/useSocialIcon'
import useTheme from '~/hooks/useTheme'
import { prisma } from '~/lib/db'
import { trpc } from '~/lib/trpc'
import { cn } from '~/lib/utils'

enum STEP {
  LIST = 0,
  ADD = 1,
}

export default function SettingsPage() {
  const {
    data: socialIcons,
    hotReloadIframe: refetchSocialIcon,
    isLoading: isLoadingSocialIcon,
  } = useSocialIcon()
  const {
    data: site,
    hotReloadIframe: refetchSite,
    isLoading: isLoadingSite,
  } = useSite()
  const {
    data: theme,
    hotReloadIframe: refetch,
    isLoading: isLoadingTheme,
  } = useTheme()
  const [hideLogo, setHideLogo] = React.useState<boolean>(
    theme?.hideLogo ?? false
  )

  React.useEffect(() => {
    setHideLogo(theme?.hideLogo ?? false)
  }, [])

  const updateThemeMutation = trpc.theme.updateTheme.useMutation({
    onSuccess() {
      refetch()
      toast.success('success')
    },
  })

  const handleHideLogo = () => {
    setHideLogo(!hideLogo)
    updateThemeMutation.mutateAsync({ hideLogo: !hideLogo })
  }

  return (
    <>
      <DashboardTemplate>
        <NextSeo title='Settings - Circle' />
        <ContentContainer>
          {isLoadingSite && isLoadingSocialIcon && isLoadingTheme ? (
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
            <>
              <div className=''>
                <div className='flex items-center gap-x-2'>
                  <div className=' flex h-6 w-6 items-center justify-center rounded-lg bg-violet-700 text-white'>
                    <HiEmojiHappy />
                  </div>
                  <h1 className=' text-lg font-semibold text-gray-900'>
                    Social Icon
                  </h1>
                </div>
                <CardSocialIcon socialIcons={socialIcons} theme={theme} />
              </div>

              <div className=' mt-8'>
                <div className=' w-full rounded-[24px] bg-white p-6'>
                  <div className='flex justify-between'>
                    <p className=' font-medium text-gray-800'>Hide the Logo</p>
                    <Switch
                      className=' data-[state=checked]:bg-green-700 data-[state=unchecked]:bg-gray-200'
                      checked={hideLogo}
                      onCheckedChange={handleHideLogo}
                    />
                  </div>
                  <Logo className=' mt-4' />
                </div>
              </div>

              <div className=' mt-8'>
                <div className='flex items-center gap-x-2'>
                  <div className=' flex h-6 w-6 items-center justify-center rounded-lg  bg-violet-700 text-white'>
                    <LuSearch size={14} />
                  </div>
                  <h1 className=' text-lg font-semibold text-gray-900'>
                    SEO {}
                  </h1>
                </div>
                {isLoadingSite ? null : (
                  <CardSeo site={site} refetch={refetchSite} />
                )}
              </div>
            </>
          )}
        </ContentContainer>
      </DashboardTemplate>
    </>
  )
}

interface IconItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: {
    label: string
    icon: IconType
  }
}

function IconItem({ icon: { label, icon: Icon }, ...props }: IconItemProps) {
  return (
    <button
      className={cn(
        ' flex h-[60px] w-full cursor-pointer items-center gap-x-4 rounded-full px-6 font-medium hover:bg-gray-100'
      )}
      {...props}
    >
      <Icon size={20} />
      {label}
    </button>
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
