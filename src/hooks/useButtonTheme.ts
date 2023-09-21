import { Theme } from '@prisma/client'
import { BACKGROUND_LIST, BACKGROUND_TYPE, BUTTON_TYPE } from '~/types/theme'

export function getButtonTheme(theme: Theme) {
  const backgroundType = theme?.backgroundType ?? BACKGROUND_TYPE.SOLID
  const buttonType = theme?.buttonType ?? BUTTON_TYPE.HARDSHADOW
  const shadowColor = theme?.shadowColor ?? '#000000'

  const buttonStyle = {
    backgroundColor: theme?.buttonColor ?? '#ffffff',
    color: theme?.buttonFontColor ?? '#000000',
    boxShadow: '',
    border: '',
    borderRadius: '',
  } as React.CSSProperties

  if (BACKGROUND_LIST.includes(backgroundType)) {
    switch (buttonType) {
      case BUTTON_TYPE.HARDSHADOW:
        buttonStyle.boxShadow = `6px 6px 0 0 ${shadowColor}`
        buttonStyle.border = `2px solid ${shadowColor}`
        buttonStyle.borderRadius = '0'
        break
      case BUTTON_TYPE.HARDSHADOWROUNDED:
        buttonStyle.boxShadow = `6px 6px 0 0 ${shadowColor}`
        buttonStyle.border = `2px solid ${shadowColor}`
        buttonStyle.borderRadius = '8px'

        break
      case BUTTON_TYPE.HARDSHADOWROUNDEDFULL:
        buttonStyle.boxShadow = `6px 6px 0 0 ${shadowColor}`
        buttonStyle.border = `2px solid ${shadowColor}`
        buttonStyle.borderRadius = '9999px'
        break
      case BUTTON_TYPE.FILL:
        buttonStyle.borderRadius = '0'
        break
      case BUTTON_TYPE.FILLROUNDED:
        buttonStyle.borderRadius = '8px'
        break
      case BUTTON_TYPE.FILLROUNDEDFULL:
        buttonStyle.borderRadius = '9999px'
        break
      case BUTTON_TYPE.OUTLINE:
        buttonStyle.backgroundColor = 'transparent'
        buttonStyle.color = `${theme.buttonFontColor}`
        buttonStyle.border = `2px solid ${theme.buttonColor}`
        break
      case BUTTON_TYPE.OUTLINEROUNDED:
        buttonStyle.backgroundColor = 'transparent'
        buttonStyle.color = `${theme.buttonFontColor}`
        buttonStyle.border = `2px solid ${theme.buttonColor}`
        buttonStyle.borderRadius = '8px'
        break
      case BUTTON_TYPE.OUTLINEROUNDEDFULL:
        buttonStyle.backgroundColor = 'transparent'
        buttonStyle.color = `${theme.buttonFontColor}`
        buttonStyle.border = `2px solid ${theme.buttonColor}`
        buttonStyle.borderRadius = '9999px'
        break
      case BUTTON_TYPE.SOFTSHADOW:
        buttonStyle.boxShadow = '0px 10px 15px -3px rgba(0, 0, 0, 0.3)'
        break
      case BUTTON_TYPE.SOFTSHADOWROUNDED:
        buttonStyle.boxShadow = '0px 10px 15px -3px rgba(0, 0, 0, 0.3)'
        buttonStyle.borderRadius = '8px'
        break
      case BUTTON_TYPE.SOFTSHADOWROUNDEDFULL:
        buttonStyle.boxShadow = '0px 10px 15px -3px rgba(0, 0, 0, 0.3)'
        buttonStyle.borderRadius = '9999px'
        break
    }
  } else {
    switch (theme.backgroundType) {
      case BACKGROUND_TYPE.WIREFRAME:
        buttonStyle.backgroundColor = '#ffffff'
        buttonStyle.boxShadow = `5px 5px 0 0 #000000`
        buttonStyle.border = `2px solid #000000`
        buttonStyle.color = 'black'
        break
      case BACKGROUND_TYPE.MINERAL_BLUE:
      case BACKGROUND_TYPE.MINERAL_GREEN:
      case BACKGROUND_TYPE.MINERAL_ORANGE:
      case BACKGROUND_TYPE.MINERAL_YELLOW:
        buttonStyle.backgroundColor = 'transparent'
        buttonStyle.border = `1.2px solid #d1d5db`
        buttonStyle.borderRadius = '9999px'
        buttonStyle.color = 'black'
        break
    }
  }

  return buttonStyle
}

export const getThumbnailTheme = (buttonType: BUTTON_TYPE) => {
  const thumbnailStyle = {
    borderRadius: '0px',
  } as React.CSSProperties

  if (
    [
      BUTTON_TYPE.FILLROUNDED,
      BUTTON_TYPE.HARDSHADOWROUNDED,
      BUTTON_TYPE.OUTLINEROUNDED,
      BUTTON_TYPE.SOFTSHADOWROUNDED,
    ].includes(buttonType)
  ) {
    thumbnailStyle.borderRadius = '4px'
  }

  if (
    [
      BUTTON_TYPE.FILLROUNDEDFULL,
      BUTTON_TYPE.HARDSHADOWROUNDEDFULL,
      BUTTON_TYPE.OUTLINEROUNDEDFULL,
      BUTTON_TYPE.SOFTSHADOWROUNDEDFULL,
    ].includes(buttonType)
  ) {
    thumbnailStyle.borderRadius = '999px'
  }
  return thumbnailStyle
}
