import React from 'react'
import Link from 'next/link'

interface GoldButtonProps {
  children: React.ReactNode
  href?: string
  external?: boolean
  variant?: 'primary' | 'outline'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

export default function GoldButton({
  children,
  href,
  external = false,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
}: GoldButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-7 py-3 font-sans text-sm font-medium tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold'

  const variants = {
    primary:
      'bg-gold text-black hover:bg-gold-light active:scale-95',
    outline:
      'border border-gold text-gold hover:bg-gold hover:text-black active:scale-95',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    )
  }

  if (href && !external) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
