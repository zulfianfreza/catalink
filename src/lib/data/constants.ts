import {
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLink,
  HiOutlinePuzzle,
} from 'react-icons/hi'

export const TABS = [
  {
    label: 'Profile',
    value: 'profile',
  },
  {
    label: 'Themes & Backgrounds',
    value: 'themes',
  },
  {
    label: 'Icons & Buttons',
    value: 'buttons',
  },
  {
    label: 'Fonts',
    value: 'fonts',
  },
]

export const MENU = [
  {
    label: 'Links',
    href: '/dashboard',
    icon: HiOutlineLink,
  },
  {
    label: 'Appearance',
    href: '/dashboard/appearance',
    icon: HiOutlinePuzzle,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: HiOutlineChartBar,
  },

  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: HiOutlineCog,
  },
]
