'use client'

import { useEffect, useState } from 'react'
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
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background:
            'linear-gradient(-45deg, #0d0d0d, #1c1508, #0d0d0d, #14120a, #0d0d0d, #1a1208)',
        }}
      />

      {/* Radial golden glow at center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Top vignette */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, #0d0d0d, transparent)',
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
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
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
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-2"
          >
            Atrévete a transformar
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gold leading-[1.05]"
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
            className="font-sans text-cream/55 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
          >
            Especialistas en mechas, keratina, tratamientos y más
            <br className="hidden sm:block" />
            <span className="text-gold/60"> &middot; San Borja, Lima</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none mx-auto"
          >
            <GoldButton href="#servicios" variant="outline">
              Descubrir servicios
            </GoldButton>
            <GoldButton href={WA_URL} external variant="primary">
              Reservar por WhatsApp
            </GoldButton>
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
