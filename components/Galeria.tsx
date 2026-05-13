'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

interface GalleryImage {
  src: string
  alt: string
  service: string
}

const R2 = 'https://pub-2867d18774614f369c999e6a52033a51.r2.dev/web'

const images: GalleryImage[] = [
  { src: `${R2}/image1.jpg`, alt: 'Mechas de tendencia', service: 'Mechas de Tendencia' },
  { src: `${R2}/image2.jpg`, alt: 'Cambio de look', service: 'Cambio de Look' },
  { src: `${R2}/image3.jpg`, alt: 'Coloración profesional', service: 'Coloración' },
  { src: `${R2}/image4.jpg`, alt: 'Estilo y mechas', service: 'Mechas de Tendencia' },
  { src: `${R2}/image5.jpg`, alt: 'Transformación capilar', service: 'Transformación' },
]

const AUTOPLAY_INTERVAL = 4000

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Galeria() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = useCallback(
    (index: number, dir: number) => {
      setDirection(dir)
      setCurrent((index + images.length) % images.length)
    },
    []
  )

  const next = useCallback(() => go(current + 1, 1), [current, go])
  const prev = useCallback(() => go(current - 1, -1), [current, go])

  // Autoplay
  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, paused, next])

  // Swipe drag handling
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) next()
    else if (info.offset.x > 50) prev()
  }

  return (
    <section
      id="galeria"
      className="py-24 lg:py-32 bg-card"
      aria-label="Galería de trabajos"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <SectionTitle subtitle="Nuestro trabajo" title="Resultados que hablan" />

        <div
          className="relative overflow-hidden rounded-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Aspect ratio wrapper */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[3/2]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={images[current].src}
                  alt={images[current].alt}
                  fill
                  className="object-cover select-none"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={current === 0}
                  draggable={false}
                />

                {/* Bottom overlay with service name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <motion.p
                  key={`label-${current}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="absolute bottom-6 left-6 font-serif text-gold text-lg md:text-2xl drop-shadow"
                >
                  {images[current].service}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 hover:border-gold/40 text-white/80 hover:text-gold transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 hover:border-gold/40 text-white/80 hover:text-gold transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 1 : -1)}
                aria-label={`Ir a imagen ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-6 h-1.5 bg-gold'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
