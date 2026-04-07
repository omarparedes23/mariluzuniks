'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'

interface GalleryImage {
  seed: string
  width: number
  height: number
  service: string
}

const images: GalleryImage[] = [
  { seed: 'uniks1', width: 400, height: 530, service: 'Mechas Brasileras' },
  { seed: 'uniks2', width: 400, height: 320, service: 'Morena Iluminada' },
  { seed: 'uniks3', width: 400, height: 480, service: 'Keratina & Laceado' },
  { seed: 'uniks4', width: 400, height: 340, service: 'Tratamientos Capilares' },
  { seed: 'uniks5', width: 400, height: 560, service: 'Manicure & Uñas' },
  { seed: 'uniks6', width: 400, height: 300, service: 'Cortes & Peinados' },
  { seed: 'uniks7', width: 400, height: 500, service: 'Mechas Brasileras' },
  { seed: 'uniks8', width: 400, height: 360, service: 'Morena Iluminada' },
  { seed: 'uniks9', width: 400, height: 450, service: 'Tratamientos Capilares' },
]

// Dark placeholder for blur
const DARK_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
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
          className="columns-2 md:columns-3 gap-3"
          style={{ columnGap: '12px' }}
        >
          {images.map((img) => (
            <motion.div
              key={img.seed}
              variants={itemVariants}
              className="relative group overflow-hidden mb-3 break-inside-avoid"
              style={{ breakInside: 'avoid' }}
            >
              <Image
                src={`https://picsum.photos/seed/${img.seed}/${img.width}/${img.height}`}
                alt={`Trabajo de ${img.service} en Uniks Salón & Spa`}
                width={img.width}
                height={img.height}
                className="w-full h-auto block"
                placeholder="blur"
                blurDataURL={DARK_BLUR}
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
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
