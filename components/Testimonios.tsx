'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

interface Testimonio {
  id: number
  text: string
  author: string
}

const testimonios: Testimonio[] = [
  {
    id: 1,
    text: 'El mejor salón de San Borja, mis mechas quedaron perfectas. El ambiente es hermoso y el equipo muy profesional.',
    author: 'Ana R.',
  },
  {
    id: 2,
    text: 'La keratina me duró meses, súper recomendado. Desde que descubrí Uniks no voy a ningún otro lugar.',
    author: 'Lucía M.',
  },
  {
    id: 3,
    text: 'Ambiente hermoso y profesionales increíbles. Siempre salgo feliz y sintiéndome muy linda.',
    author: 'Valeria T.',
  },
]

const AUTOPLAY_DELAY = 4000

export default function Testimonios() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonios.length)
  }, [])

  // Autoplay
  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_DELAY)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section
      className="py-24 lg:py-32 bg-card relative overflow-hidden"
      aria-label="Testimonios de clientas"
    >
      {/* Decorative background quote */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 font-serif text-[18rem] text-gold/[0.03] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <SectionTitle
          subtitle="Clientas felices"
          title="Lo que dicen nuestras clientas"
        />

        {/* Carousel */}
        <div
          className="relative min-h-[200px] flex items-center justify-center"
          role="region"
          aria-label="Carrusel de testimonios"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {/* Stars */}
              <div
                className="flex justify-center gap-1 mb-6"
                aria-label="5 estrellas"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-gold fill-gold"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6">
                <p className="font-serif italic text-xl md:text-2xl text-cream/85 leading-relaxed">
                  &ldquo;{testimonios[current].text}&rdquo;
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-gold/50" aria-hidden="true" />
                <cite className="font-sans text-sm text-gold not-italic tracking-wider">
                  {testimonios[current].author}
                </cite>
                <span className="w-8 h-px bg-gold/50" aria-hidden="true" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div
          className="flex justify-center gap-3 mt-10"
          role="tablist"
          aria-label="Navegar testimonios"
        >
          {testimonios.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Ver testimonio ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-6 h-2 bg-gold'
                  : 'w-2 h-2 bg-gold/30 hover:bg-gold/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
