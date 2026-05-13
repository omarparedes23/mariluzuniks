'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import GoldButton from '@/components/ui/GoldButton'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

const WA_URL = 'https://wa.me/51941719794'

// Stagger animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([])

  // Generate particles client-side to avoid hydration mismatch
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 6,
    }))
    setParticles(generated)
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://pub-2867d18774614f369c999e6a52033a51.r2.dev/web/portada1.jpeg"
          alt="Salón de belleza profesional"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Soft overlay ensuring general legibility without hiding image */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Elegant bottom fade gradient replacing the visual card */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)'
          }}
        />
      </div>

      {/* Radial golden glow at center, kept for subtitle accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,169,110,0.1) 0%, transparent 65%)',
        }}
      />

      {/* Top vignette to protect navbar */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [-18, 18, -18], opacity: [0.08, 0.4, 0.08] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-32 pb-12 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Eyebrow label */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-gold text-[0.7rem] tracking-[0.5em] uppercase mb-8"
          >
            San Borja &middot; Lima &middot; Perú
          </motion.p>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-2 drop-shadow-lg"
          >
            Atrévete a transformar
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gold leading-[1.05] drop-shadow-lg"
          >
            tu look
          </motion.p>

          {/* Animated gold line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="my-7 w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          />

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-cream/70 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed drop-shadow-md"
          >
            Especialistas en mechas, keratina, tratamientos y más
            <br className="hidden sm:block" />
            <span className="text-gold/70"> &middot; San Borja, Lima</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none mx-auto mt-4 items-center"
          >
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-sans tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold bg-gold text-black hover:bg-gold-light active:scale-95 shadow-lg shadow-gold/20 font-bold text-base px-8 py-4 w-full sm:w-auto"
            >
              Reservar por WhatsApp
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 font-sans tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold border border-white/30 text-cream/90 hover:bg-white/5 active:scale-95 font-normal text-xs px-6 py-3 w-full sm:w-auto mt-2 sm:mt-0"
            >
              Descubrir servicios
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-sans text-[0.6rem] tracking-[0.35em] text-gold/40 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent origin-top"
        />
      </motion.div>
    </section>
  )
}
