'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'

const DARK_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const stats = [
  { value: '500+', label: 'Clientas' },
  { value: '6', label: 'Años de experiencia' },
  { value: '100%', label: 'Equipo certificado' },
]

export default function Nosotros() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="nosotros"
      className="py-24 lg:py-32 bg-bg overflow-hidden"
      aria-label="Sobre nosotros"
    >
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center"
      >
        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative overflow-hidden">
            <Image
              src="https://picsum.photos/seed/team/600/700"
              alt="Equipo de Uniks Salón & Spa"
              width={600}
              height={700}
              className="w-full h-auto object-cover"
              placeholder="blur"
              blurDataURL={DARK_BLUR}
              priority={false}
            />

            {/* Decorative border offset */}
            <div
              className="absolute -bottom-3 -right-3 w-full h-full border border-gold/20 pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Floating "Est. 2018" badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -top-4 -right-4 lg:-right-6 bg-gold text-black w-20 h-20 flex flex-col items-center justify-center shadow-xl"
            aria-label="Establecidos en 2018"
          >
            <span className="font-sans text-[0.55rem] tracking-[0.2em] uppercase">Est.</span>
            <span className="font-serif text-xl font-medium leading-none">2018</span>
          </motion.div>
        </motion.div>

        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2"
        >
          <SectionTitle
            subtitle="Quiénes somos"
            title="Somos Uniks"
            align="left"
          />

          <p className="font-sans text-cream/60 leading-relaxed mb-8 text-base">
            Somos un equipo de profesionales apasionadas por la belleza y la
            transformación. En Uniks Salón &amp; Spa cuidamos cada detalle para
            que vivas una experiencia única, en un ambiente acogedor y con
            técnicas de primera calidad.
          </p>

          {/* Decorative gold separator */}
          <div
            className="w-16 h-px bg-gold/50 mb-8"
            aria-hidden="true"
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-left">
                <p className="font-serif text-3xl text-gold mb-1">{value}</p>
                <p className="font-sans text-xs text-cream/45 leading-snug">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
