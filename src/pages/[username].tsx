import { Link as LinkType, Site, SocialIcon, Theme, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import Avatar from '~/components/Avatar'
import Icon from '~/components/Icon'
import Logo from '~/components/Logo'
import { useBackgroundStyle } from '~/hooks/useBackgroundStyle'
import { getButtonTheme, getThumbnailTheme } from '~/hooks/useButtonTheme'
import useDataUpdated from '~/hooks/useDataUpdated'
import { getHeaderPosition, useThemeStyle } from '~/hooks/useThemeStyle'
import { SOCIAL_ICON_LIST } from '~/lib/data/social-icon'
import { prisma } from '~/lib/db'
import { trpc } from '~/lib/trpc'
import { cn, getVideoIdFromYoutubeUrl } from '~/lib/utils'
import { BUTTON_TYPE } from '~/types/theme'

interface CirclePageProps {
  site: Site
  links: LinkType[]
  theme: Theme
  socialIcons: SocialIcon[]
  user: User
}

export default function CirclePage({
  links,
  theme,
  socialIcons,
  site,
  user,
}: CirclePageProps) {
  const router = useRouter()
  const { themeData, linksData, profileData, socialIconsData } = useDataUpdated(
    {
      theme,
      links,
      profile: site,
      socialIcons,
    }
  )

  const { themeClass, themeStyle } = useThemeStyle(themeData)
  const { backgroundClass, backgroundStyle } = useBackgroundStyle(themeData)
  const buttonStyle = getButtonTheme(themeData)

  const profileTitle = profileData?.profileTitle ?? user?.username
  const bio = profileData?.bio
  const hideLogo = themeData?.hideLogo ?? false

  const socialIconPosition = themeData?.socialIconPosition ?? 'top'

  const socialIconPositionClass =
    socialIconPosition == 'top' ? 'flex-col' : 'flex-col-reverse'

  const getIcon = (iconId: number): IconType => {
    const icon = SOCIAL_ICON_LIST.find((icon) => {
      return icon.id == iconId
    })

    return icon?.icon ?? SOCIAL_ICON_LIST[0]!.icon
  }

  const updateLinkMutation = trpc.link.incrementClickCount.useMutation()

  const handleClick = (linkId: string) => {
    if (router.query.isDemo) {
      return
    }
    updateLinkMutation.mutateAsync({ linkId })
  }

  if (!user) {
    return (
      <div className=' flex h-screen w-full items-center justify-center'>
        <div className=' flex h-full max-w-lg items-center p-5'>
          <h1 className=' text-center text-xl text-gray-800'>
            The page you’re looking for doesn’t exist. Please check back soon.
          </h1>
          <Logo
            className=' absolute bottom-5 right-1/2 translate-x-1/2'
            path='/'
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        ' flex min-h-screen w-full flex-col justify-between bg-white bg-cover bg-center',
        themeClass
      )}
      style={themeStyle}
    >
      <div className=' bg-black/25 backdrop-blur-2xl'>
        <NextSeo
          title={`${
            site.metaTitle && site.metaTitle != ''
              ? site.metaTitle
              : profileTitle
              ? profileTitle
              : user.name
          } - Catalink`}
          description={site.metaDescription ?? ''}
        />
        <div
          className={cn(
            ' relative mx-auto flex h-full min-h-screen w-full max-w-lg flex-col p-5 pb-0 pt-16',
            backgroundClass
          )}
          style={backgroundStyle}
        >
          <div className=' flex-1'>
            <div className=' flex flex-col items-center justify-center gap-y-4 md:flex-row'>
              <div className=' flex flex-col items-center justify-center gap-x-8'>
                <Avatar
                  src={profileData?.profileImage ?? user?.image}
                  className=' h-24 w-24'
                />
                <div className=' mt-2 flex flex-1 flex-col gap-y-2'>
                  <div className=' text-center'>
                    <p className=' text-xl font-bold '>
                      {profileTitle != '' ? profileTitle : 'Profile Title'}
                    </p>
                    <p className=' text-center font-medium'>
                      {bio != '' ? bio : 'Bio'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cn(
                'mt-4 flex flex-col gap-y-6',
                socialIconPositionClass
              )}
            >
              <div className='flex flex-wrap items-center justify-center gap-2'>
                {socialIconsData.map((socialIcon, index) => {
                  return (
                    socialIcon.active && (
                      <Link href={socialIcon.url} target='_blank' key={index}>
                        <Icon icon={getIcon(socialIcon.iconId)} size={20} />
                      </Link>
                    )
                  )
                })}
              </div>

              <div className='flex flex-col gap-y-3'>
                {linksData?.map((link) => {
                  if (
                    link.type == 'link' &&
                    link.active &&
                    link.content != '' &&
                    link.label != ''
                  ) {
                    return (
                      <Link
                        href={link.content ?? ''}
                        target='_blank'
                        key={link.id}
                        onClick={() => handleClick(link.id)}
                        className={cn(
                          ' relative flex min-h-[56px] w-full items-center justify-center px-[56px] py-4 transition duration-300 ease-in-out hover:scale-[1.05]'
                          // {
                          //   'w-[calc(100%-4px)]':
                          //     buttonType === BUTTON_TYPE.HARDSHADOW ||
                          //     buttonType === BUTTON_TYPE.HARDSHADOWROUNDED ||
                          //     buttonType === BUTTON_TYPE.HARDSHADOWROUNDEDFULL,
                          // }
                        )}
                        style={buttonStyle}
                      >
                        {link.thumbnailType != null &&
                        link.thumbnailType != '' &&
                        link.thumbnailType == 'icon' ? (
                          <div className=' absolute left-1.5 flex aspect-square h-10 items-center justify-center'>
                            <Icon icon={getIcon(link.iconId ?? 0)} size={24} />
                          </div>
                        ) : link.thumbnailType == 'image' ? (
                          <div className=' absolute left-1.5'>
                            <div
                              className=' relative aspect-square h-11 overflow-hidden'
                              style={getThumbnailTheme(
                                themeData.buttonType as BUTTON_TYPE
                              )}
                            >
                              <Image
                                src={link.imageUrl ?? ''}
                                alt=''
                                fill
                                className=' object-cover'
                              />
                            </div>
                          </div>
                        ) : null}
                        <p className=' text-center text-sm'>{link.label}</p>
                      </Link>
                    )
                  }

                  if (
                    link.type == 'header' &&
                    link.active &&
                    link.label != ''
                  ) {
                    return (
                      <div
                        className='font-semibold'
                        key={link.id}
                        style={getHeaderPosition(
                          link.headerPosition ?? 'center'
                        )}
                      >
                        <p>{link.label}</p>
                      </div>
                    )
                  }

                  if (
                    link.type == 'youtube' &&
                    link.active &&
                    link.content != ''
                  ) {
                    return (
                      <iframe
                        className=' aspect-video w-full'
                        src={`https://www.youtube.com/embed/${getVideoIdFromYoutubeUrl(
                          link.content ?? ''
                        )}`}
                        title='YouTube video player'
                        frameBorder={0}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowFullScreen
                      />
                    )
                  }

                  if (
                    link.type == 'text-link' &&
                    link.active &&
                    link.content != '' &&
                    link.label != ''
                  ) {
                    return (
                      <Link
                        className=' text-center underline '
                        href={link.content ?? ''}
                        target='_blank'
                        key={link.id}
                        onClick={() => handleClick(link.id)}
                      >
                        {link.label}
                      </Link>
                    )
                  }
                })}
              </div>
            </div>
          </div>
          {!hideLogo && (
            <div
              className={cn(
                ' flex items-center justify-center  gap-x-1 justify-self-end py-8 font-semibold'
              )}
            >
              <Logo />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const username = (params ? params.username : '') as string
  const isDemo = (query ? query.isDemo : false) as boolean

  const user = await prisma.user.findUnique({
    where: { username: username },
  })

  const links = await prisma.link.findMany({
    where: {
      userId: user?.id ?? null,
    },
    orderBy: [{ index: 'asc' }],
  })

  const socialIcons = await prisma.socialIcon.findMany({
    where: {
      userId: user ? user.id : undefined,
    },
  })

  const theme = await prisma.theme.findFirst({
    where: {
      userId: user ? user.id : null,
    },
  })

  const site = await prisma.site.findFirst({
    where: {
      userId: user?.id,
    },
  })

  if (!isDemo && user) {
    await prisma.site.upsert({
      create: {
        viewCount: 1,
        userId: user?.id,
      },
      where: {
        userId: user?.id ?? undefined,
      },
      update: {
        viewCount: { increment: 1 },
      },
    })
  }

  return {
    props: {
      user,
      links,
      theme,
      socialIcons,
      site,
    },
  }
}
