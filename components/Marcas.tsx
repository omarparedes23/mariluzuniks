'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

interface Marca {
  name: string
  logoSrc: string
  highlight?: string
}

// Logos locales de las marcas
const marcas: Marca[] = [
  { 
    name: "L'Oréal Paris", 
    logoSrc: "/images/loreal.png",
    highlight: "Profesional" 
  },
  { 
    name: "Italian Max", 
    logoSrc: "/images/italianmax.jpg",
  },
  { 
    name: "OPI", 
    logoSrc: "/images/opi.jpg",
  },
  { 
    name: "Kleral", 
    logoSrc: "/images/kleral.jpg",
    highlight: "Made in Italy" 
  },
  { 
    name: "Just", 
    logoSrc: "/images/just.png",
  },
  { 
    name: "Baor", 
    logoSrc: "/images/baor.png",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Marcas() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      className="py-20 lg:py-24 bg-card border-y border-gold/10"
      aria-label="Marcas con las que trabajamos"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-gold text-xs tracking-[0.4em] uppercase mb-3">
            Productos de calidad
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream">
            Trabajamos con las mejores marcas
          </h2>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-14"
        >
          {marcas.map((marca) => (
            <motion.div
              key={marca.name}
              variants={itemVariants}
              className="group flex flex-col items-center"
            >
              <div className="relative w-36 h-20 md:w-44 md:h-24 flex items-center justify-center bg-bg/50 border border-gold/10 rounded-lg p-4 hover:border-gold/40 transition-all duration-300 hover:bg-bg overflow-hidden">
                <Image
                  src={marca.logoSrc}
                  alt={`Logo de ${marca.name}`}
                  fill
                  className="object-contain p-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                  sizes="(max-width: 768px) 144px, 176px"
                />
              </div>
              {marca.highlight && (
                <span className="mt-2 font-sans text-[0.6rem] tracking-widest uppercase text-gold/60">
                  {marca.highlight}
                  </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center font-sans text-sm text-cream/40 mt-12 max-w-2xl mx-auto"
        >
          Utilizamos productos premium reconocidos internacionalmente para garantizar 
          los mejores resultados en cada servicio.
        </motion.p>
      </div>
    </section>
  )
}
