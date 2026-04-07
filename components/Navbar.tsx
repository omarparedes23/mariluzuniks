'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

const WA_URL = 'https://wa.me/51941719794'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-bg/90 backdrop-blur-md border-b border-gold/10 shadow-lg shadow-black/20'
            : ''
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none group"
            aria-label="Uniks Salón & Spa — inicio"
          >
            <span className="font-serif text-[1.6rem] text-gold tracking-wide group-hover:text-gold-light transition-colors">
              Uniks
            </span>
            <span className="font-sans text-[0.6rem] text-gold/60 tracking-[0.35em] uppercase mt-[-2px]">
              Salón &amp; Spa
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-sans text-sm text-cream/60 hover:text-gold transition-colors duration-200 relative group"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            {/* <Link href="/login">Acceder</Link> — Fase 2 */}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-widest uppercase px-6 py-2.5 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
            >
              Reservar cita
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gold p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación móvil"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card border-l border-gold/15 flex flex-col p-8 md:hidden"
          >
            {/* Close button */}
            <button
              onClick={closeMenu}
              className="self-end text-gold mb-10"
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>

            {/* Logo in drawer */}
            <div className="mb-10">
              <span className="font-serif text-2xl text-gold">Uniks</span>
              <p className="font-sans text-[0.6rem] text-gold/50 tracking-[0.3em] uppercase">
                Salón &amp; Spa
              </p>
            </div>

            {/* Nav links */}
            <ul className="flex flex-col gap-2" role="list">
              {navLinks.map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <a
                    href={href}
                    onClick={closeMenu}
                    className="font-serif text-2xl text-cream/80 hover:text-gold transition-colors block py-2"
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* CTA bottom */}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mt-auto font-sans text-xs tracking-widest uppercase py-4 border border-gold text-center text-gold hover:bg-gold hover:text-black transition-all duration-300"
            >
              Reservar cita
            </a>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
