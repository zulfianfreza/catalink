import React from 'react'
import { IconBaseProps, IconType } from 'react-icons'

interface IconProps extends IconBaseProps {
  icon: IconType
}

export default function Icon({ icon: Icon, ...props }: IconProps) {
  return <Icon {...props} />
}
