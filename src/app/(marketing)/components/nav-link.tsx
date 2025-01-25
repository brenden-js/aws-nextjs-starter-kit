import Link from 'next/link'
import {type ReactNode} from 'react'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function NavLink({href, children, className}: NavLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
