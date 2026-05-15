'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

interface NavLinkProps {
  href: string
  label: string
  icon: LucideIcon
}

export default function NavLink({ href, label, icon: Icon }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'))

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'text-gold bg-gold/10'
          : 'text-cream/80 hover:text-gold hover:bg-gold/10'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  )
}
