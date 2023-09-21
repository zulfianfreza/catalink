import Link from 'next/link'
import type { IconType } from 'react-icons'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'
import clsx from 'clsx'
import useActiveMenu from '~/hooks/useActiveMenu'

interface MenuItemProps {
  label: string
  href: string
  icon: IconType
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  href,
  icon: Icon,
}) => {
  const pathname = usePathname()

  const active = useActiveMenu(pathname, href)

  return (
    <Link
      href={href}
      className={cn(
        ' flex items-center gap-x-1 self-auto rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100',
        {
          'text-gray-900': active,
        }
      )}
    >
      <Icon size={20} />
      {label}
    </Link>
  )
}

export const MenuItemMobile: React.FC<MenuItemProps> = ({
  label,
  href,
  icon: Icon,
}) => {
  const pathname = usePathname()

  const active = useActiveMenu(pathname, href)

  return (
    <Link
      href={href}
      className={cn(
        ' flex flex-1 flex-col items-center justify-center  py-2 text-xs font-medium text-gray-500 hover:bg-gray-100',
        { 'border-b-2 border-b-violet-700 text-gray-900': active }
      )}
    >
      <Icon size={16} />
      {label}
    </Link>
  )
}
