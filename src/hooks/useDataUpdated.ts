import { Link, Site, SocialIcon, Theme, User } from '@prisma/client'
import { useEffect, useState } from 'react'

interface Props {
  theme: Theme
  links: Link[]
  profile: Site
  socialIcons: SocialIcon[]
}

export default function useDataUpdated({
  theme,
  links,
  profile,
  socialIcons,
}: Props) {
  const [themeData, setThemeData] = useState(theme)
  const [linksData, setLinksData] = useState(links)
  const [profileData, setProfileData] = useState(profile)
  const [socialIconsData, setSocialIconData] = useState(socialIcons)

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'theme-updated') {
        setThemeData(event.data.theme)
      }
      if (event.data.type === 'links-updated') {
        setLinksData(event.data.links)
      }
      if (event.data.type === 'profile-updated') {
        setProfileData(event.data.profile)
      }
      if (event.data.type === 'socialicon-updated') {
        setSocialIconData(event.data.socialIcon)
      }
    })
  }, [])

  return {
    themeData,
    linksData,
    profileData,
    socialIconsData,
  }
}
