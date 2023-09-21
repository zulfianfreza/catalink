import { Theme } from '@prisma/client'
import { FONT_LIST, balsamiqSans, spaceMono } from '~/lib/data/font'
import { BACKGROUND_TYPE } from '~/types/theme'
import * as React from 'react'

export const useBackgroundStyle = (theme: Theme) => {
  let backgroundClass

  let backgroundStyle

  const backgroundType = theme ? theme.backgroundType : BACKGROUND_TYPE.SOLID
  const backgroundImage = theme ? theme.backgroundImage : ''
  const backgroundPrimary = theme ? theme.backgroundPrimary : '#ffffff'
  const backgroundSecondary = theme ? theme.backgroundSecondary : '#6d28d9'

  if (
    [
      BACKGROUND_TYPE.SOLID as string,
      BACKGROUND_TYPE.GRADIENT as string,
      BACKGROUND_TYPE.IMAGE as string,
    ].includes(backgroundType)
  ) {
    backgroundStyle = {
      backgroundColor: backgroundPrimary ?? '#fff',
      backgroundImage: '',
      backgroundSize: 'cover',
    } as React.CSSProperties
    switch (backgroundType) {
      case BACKGROUND_TYPE.SOLID:
        backgroundStyle.backgroundColor = backgroundPrimary
          ? backgroundPrimary
          : '#ffffff'
        break
      case BACKGROUND_TYPE.GRADIENT:
        backgroundStyle.backgroundImage = `linear-gradient(to top right, ${backgroundPrimary}, ${backgroundSecondary})`
        break
      case BACKGROUND_TYPE.IMAGE:
        backgroundStyle.backgroundImage = `url("${backgroundImage ?? ''}")`
        backgroundStyle.backgroundSize = 'cover'
        backgroundStyle.backgroundColor = ''
    }
  } else {
    backgroundStyle = {
      color: '',
      backgroundAttachment: 'fixed',
    } as React.CSSProperties
    switch (backgroundType) {
      case BACKGROUND_TYPE.CUBE:
        backgroundClass = `bg-cube `

        break
      case BACKGROUND_TYPE.COLORFUL:
        backgroundClass = `bg-colorful `

        break
      case BACKGROUND_TYPE.POLKA:
        backgroundClass = `bg-polka `

        break
      case BACKGROUND_TYPE.HEXAGON:
        backgroundClass = `bg-hexagon `

        break
      case BACKGROUND_TYPE.MOON:
        backgroundClass = `bg-moon `

        break
      case BACKGROUND_TYPE.SPRINKLE:
        backgroundClass = `bg-sprinkle `

        break
      case BACKGROUND_TYPE.COLORED_PATTERNS:
        backgroundClass = `bg-colored-patterns `

        break
      case BACKGROUND_TYPE.COLORED_SHAPES:
        backgroundClass = `bg-colored-shapes `

        break
      case BACKGROUND_TYPE.CLOUDY:
        backgroundClass = `bg-cloudy  bg-cover`

        break
      case BACKGROUND_TYPE.CONTOUR_LINE:
        backgroundClass = `bg-contour-line  bg-cover`

        break
      case BACKGROUND_TYPE.WIREFRAME:
        backgroundClass = `bg-white ${balsamiqSans.className} text-black`
        break
      case BACKGROUND_TYPE.MINERAL_BLUE:
        backgroundClass = `bg-[#e0f6ff] ${spaceMono.className} text-black`

        break
      case BACKGROUND_TYPE.MINERAL_GREEN:
        backgroundClass = `bg-[#e0faee] ${spaceMono.className} text-black`

        break
      case BACKGROUND_TYPE.MINERAL_ORANGE:
        backgroundClass = `bg-[#ffeee1] ${spaceMono.className} text-black`

        break
      case BACKGROUND_TYPE.MINERAL_YELLOW:
        backgroundClass = `bg-[#fff8e0] ${spaceMono.className} text-black`

        break
    }
  }

  return {
    backgroundClass,
    backgroundStyle,
  }
}
