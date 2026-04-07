'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Scissors, Sparkles, Wind, Brush, Gem, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

interface Servicio {
  id: number
  icon: LucideIcon
  name: string
  description: string
  imageUrl: string
  featured?: boolean
}

// Imágenes de Unsplash relacionadas con cada servicio
const servicios: Servicio[] = [
  {
    id: 1,
    icon: Star,
    name: 'Cambio de Look',
    description: 'Transformación completa para renovar tu imagen. Asesoría profesional personalizada.',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
    featured: true,
  },
  {
    id: 2,
    icon: Scissors,
    name: 'Cortes',
    description: 'Cortes modernos y clásicos adaptados a tu estilo y estructura facial.',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop',
    featured: true,
  },
  {
    id: 3,
    icon: Sparkles,
    name: 'Mechas de Tendencia',
    description: 'Técnicas de última generación: balayage, baby lights, mechas brasileras y más.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
    featured: true,
  },
  {
    id: 4,
    icon: Wind,
    name: 'Peinado',
    description: 'Peinados para todo tipo de eventos: bodas, fiestas, graduaciones y más.',
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    icon: Brush,
    name: 'Maquillaje',
    description: 'Maquillaje profesional para resaltar tu belleza natural en cualquier ocasión.',
    imageUrl: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    icon: Gem,
    name: 'Uñas de Tendencia',
    description: 'Diseños exclusivos y modernos con acabados impecables y duraderos.',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop',
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

        {/* Especialidad destacada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-serif text-xl md:text-2xl text-gold italic">
            "Nuestro fuerte es el cabello"
          </p>
          <p className="font-sans text-sm text-cream/50 mt-2">
            Especialistas en transformaciones capilares
          </p>
        </motion.div>

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
  const { icon: Icon, name, description, imageUrl, featured } = servicio

  return (
    <motion.article
      variants={cardVariants}
      className={`group relative bg-card border overflow-hidden hover:border-gold/50 transition-all duration-400 ${
        featured ? 'border-gold/30' : 'border-gold/10'
      }`}
      aria-label={name}
    >
      {/* Featured badge */}
      {featured && (
        <span className="absolute top-3 right-3 z-10 text-[0.6rem] tracking-widest uppercase text-gold/80 bg-black/60 backdrop-blur-sm px-2 py-1">
          Especialidad
        </span>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Servicio de ${name} en Uniks Salón`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Gold accent line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Icon and Title */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 border flex items-center justify-center text-gold shrink-0 ${
              featured ? 'border-gold/50' : 'border-gold/30'
            }`}
            aria-hidden="true"
          >
            <Icon size={18} />
          </div>
          <h3 className="font-serif text-xl text-cream">{name}</h3>
        </div>

        {/* Description */}
        <p className="font-sans text-sm text-cream/55 leading-relaxed">
          {description}
        </p>

        {/* CTA */}
        <a
          href={`${WA_URL}?text=Hola, me interesa el servicio de ${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs tracking-widest uppercase text-gold/70 hover:text-gold transition-colors duration-200 flex items-center gap-2 group/link mt-2"
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
      </div>

      {/* Top gold line on hover */}
      <span
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        aria-hidden="true"
      />
    </motion.article>
  )
}
