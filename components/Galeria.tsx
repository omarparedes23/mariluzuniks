'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'

interface GalleryImage {
  src: string
  alt: string
  service: string
}

const images: GalleryImage[] = [
  { src: '/images/image1.jpg', alt: 'Mechas de tendencia', service: 'Mechas de Tendencia' },
  { src: '/images/image2.jpg', alt: 'Cambio de look', service: 'Cambio de Look' },
  { src: '/images/image3.jpg', alt: 'Coloración profesional', service: 'Coloración' },
  { src: '/images/image4.jpg', alt: 'Estilo y mechas', service: 'Mechas de Tendencia' },
  { src: '/images/image5.jpg', alt: 'Transformación capilar', service: 'Transformación' },
]

// Dark placeholder for blur
const DARK_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Galeria() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="galeria"
      className="py-24 lg:py-32 bg-card"
      aria-label="Galería de trabajos"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle subtitle="Nuestro trabajo" title="Resultados que hablan" />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {images.map((img, index) => (
            <motion.div
              key={img.src}
              variants={itemVariants}
              className="relative group overflow-hidden aspect-[3/4]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={DARK_BLUR}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                aria-hidden="true"
              >
                <p className="font-serif text-gold text-sm">{img.service}</p>
              </div>

              {/* Gold border on hover */}
              <div
                className="absolute inset-0 border border-gold/0 group-hover:border-gold/40 transition-all duration-300 pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
