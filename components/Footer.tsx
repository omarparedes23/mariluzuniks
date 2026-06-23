import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.86a8.18 8.18 0 0 0 4.78 1.52V6.93a4.85 4.85 0 0 1-1.01-.24z" />
    </svg>
  )
}

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
  {
    label: 'TikTok de Uniks Salón & Spa',
    href: 'https://www.tiktok.com/@unikssalon',
    icon: TikTokIcon,
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

        {/* Instagram handle */}
        <a
          href="https://www.instagram.com/unikssalonspa"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-cream/30 hover:text-gold transition-colors tracking-wider"
        >
          @unikssalonspa
        </a>

        {/* Closing phrase */}
        <p className="font-serif italic text-gold/40 text-sm text-center">
          &ldquo;Sentirte linda es una elección de todos los días&rdquo;
        </p>

        {/* Copyright */}
        <p className="font-sans text-[0.65rem] text-cream/20 tracking-wider text-center">
          &copy; 2025 Uniks Salón &amp; Spa &middot; San Borja, Lima
        </p>

        {/* Privacy policy */}
        <Link
          href="/privacidad"
          className="font-sans text-[0.6rem] text-cream/20 hover:text-cream/50 transition-colors tracking-wider"
        >
          Política de Privacidad
        </Link>

        {/* Admin access — intentionally subtle */}
        <Link
          href="/admin"
          className="font-sans text-[0.6rem] text-cream/10 hover:text-cream/30 transition-colors tracking-wider"
        >
          Administración
        </Link>
      </div>
    </footer>
  )
}
