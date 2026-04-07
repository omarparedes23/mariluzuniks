import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'

const navLinks = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

const socialLinks = [
  {
    label: 'Instagram de Uniks Salón & Spa',
    href: 'https://www.instagram.com/unikssalonspa',
    icon: Instagram,
  },
  {
    label: 'Facebook de Uniks Salón & Spa',
    href: 'https://www.facebook.com/share/14YEPYgBVai/',
    icon: Facebook,
  },
]

export default function Footer() {
  return (
    <footer
      className="bg-[#0a0a0a] border-t border-gold/20 pt-12 pb-8"
      aria-label="Pie de página"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col items-center leading-none group"
          aria-label="Uniks Salón & Spa — inicio"
        >
          <span className="font-serif text-3xl text-gold group-hover:text-gold-light transition-colors tracking-wide">
            Uniks
          </span>
          <span className="font-sans text-[0.6rem] text-gold/50 tracking-[0.4em] uppercase mt-0.5">
            Salón &amp; Spa
          </span>
        </Link>

        {/* Decorative line */}
        <div
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
          aria-hidden="true"
        />

        {/* Quick links */}
        <nav aria-label="Links rápidos de pie de página">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2" role="list">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-sans text-xs text-cream/40 hover:text-gold transition-colors tracking-wider uppercase"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social icons */}
        <div className="flex items-center gap-4" aria-label="Redes sociales">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 border border-gold/20 flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold/50 transition-all duration-300"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        {/* Closing phrase */}
        <p className="font-serif italic text-gold/40 text-sm text-center">
          &ldquo;Sentirte linda es una elección de todos los días&rdquo;
        </p>

        {/* Copyright */}
        <p className="font-sans text-[0.65rem] text-cream/20 tracking-wider text-center">
          &copy; 2025 Uniks Salón &amp; Spa &middot; San Borja, Lima
        </p>
      </div>
    </footer>
  )
}
