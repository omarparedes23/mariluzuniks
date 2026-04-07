'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Scissors, Sparkles, Droplets, Leaf, Gem, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

interface Servicio {
  id: number
  icon: LucideIcon
  name: string
  description: string
}

const servicios: Servicio[] = [
  {
    id: 1,
    icon: Scissors,
    name: 'Mechas Brasileras',
    description: 'Luz y dimensión para tu cabello con técnicas de última generación.',
  },
  {
    id: 2,
    icon: Sparkles,
    name: 'Morena Iluminada',
    description: 'Reflejos naturales y sofisticados que realzan tu belleza.',
  },
  {
    id: 3,
    icon: Droplets,
    name: 'Keratina & Laceado',
    description: 'Cabello liso, saludable y con vida que dura semanas.',
  },
  {
    id: 4,
    icon: Leaf,
    name: 'Tratamientos Capilares',
    description: 'Restaura, hidrata y rejuvenece tu cabello con productos premium.',
  },
  {
    id: 5,
    icon: Gem,
    name: 'Manicure & Uñas',
    description: 'Diseños que expresan tu personalidad con acabados impecables.',
  },
  {
    id: 6,
    icon: Wind,
    name: 'Cortes & Peinados',
    description: 'El corte perfecto para tu estilo y estructura facial.',
  },
]

const WA_URL = 'https://wa.me/51941719794'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Servicios() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      id="servicios"
      className="py-24 lg:py-32 bg-bg"
      aria-label="Nuestros servicios"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle subtitle="Lo que ofrecemos" title="Nuestros Servicios" />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {servicios.map((servicio) => (
            <ServiceCard key={servicio.id} servicio={servicio} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ServiceCard({ servicio }: { servicio: Servicio }) {
  const { icon: Icon, name, description } = servicio

  return (
    <motion.article
      variants={cardVariants}
      className="group relative bg-card border border-gold/10 p-8 flex flex-col gap-5 hover:border-gold/50 transition-colors duration-400 overflow-hidden"
      aria-label={name}
    >
      {/* Top gold line on hover */}
      <span
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors duration-300"
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="font-serif text-xl text-cream mb-2">{name}</h3>
        <p className="font-sans text-sm text-cream/55 leading-relaxed">
          {description}
        </p>
      </div>

      {/* CTA */}
      <a
        href={`${WA_URL}?text=Hola, me interesa el servicio de ${encodeURIComponent(name)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-xs tracking-widest uppercase text-gold/70 hover:text-gold transition-colors duration-200 flex items-center gap-2 group/link"
        aria-label={`Consultar sobre ${name} por WhatsApp`}
      >
        Consultar
        <span
          className="inline-block transition-transform duration-200 group-hover/link:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </a>
    </motion.article>
  )
}
