'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'

const WA_URL = 'https://wa.me/51941719794'
const WA_MESSAGE = encodeURIComponent('Hola, me gustaría reservar una cita en Uniks Salón & Spa.')

interface InfoItem {
  icon: React.ElementType
  label: string
  value: string
  link?: string
}

const infoItems: InfoItem[] = [
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Alejandro Scarlatti, San Borja 15037, Lima, Perú',
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'Lunes a Sábado · 9:30 – 20:00',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '941 719 794',
    link: 'tel:+51941719794',
  },
]

export default function Contacto() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      id="contacto"
      className="py-24 lg:py-32 bg-bg"
      aria-label="Información de contacto y ubicación"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle subtitle="Encuéntranos" title="Contacto" />

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
        >
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8"
          >
            <ul className="flex flex-col gap-6" role="list">
              {infoItems.map(({ icon: Icon, label, value, link }) => (
                <li key={label} className="flex items-start gap-4">
                  <span
                    className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="font-sans text-xs text-gold/60 tracking-widest uppercase mb-0.5">
                      {label}
                    </p>
                    {link ? (
                      <a
                        href={link}
                        className="font-sans text-cream/75 hover:text-gold transition-colors text-sm leading-relaxed"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-sans text-cream/75 text-sm leading-relaxed">
                        {value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={`${WA_URL}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gold text-black font-sans text-sm font-medium tracking-widest uppercase px-8 py-4 hover:bg-gold-light transition-colors duration-300 w-full sm:w-auto"
              aria-label="Reservar cita por WhatsApp"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Reservar por WhatsApp
            </a>

            {/* Phone */}
            <p className="font-sans text-xs text-cream/35">
              También puedes llamarnos al{' '}
              <a
                href="tel:+51941719794"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                941 719 794
              </a>
            </p>
          </motion.div>

          {/* Map column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full aspect-video lg:aspect-[4/3] overflow-hidden border border-gold/15">
              <iframe
                src="https://maps.google.com/maps?q=Alejandro+Scarlatti+San+Borja+Lima+Peru&output=embed"
                className="absolute inset-0 w-full h-full border-0 grayscale"
                loading="lazy"
                title="Ubicación Uniks Salón & Spa en San Borja, Lima"
                aria-label="Mapa de ubicación de Uniks Salón & Spa"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Overlay to tint map dark */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(13,13,13,0.1) 0%, rgba(13,13,13,0.05) 100%)',
                  mixBlendMode: 'multiply',
                }}
                aria-hidden="true"
              />
            </div>
            <p className="font-sans text-xs text-cream/30 mt-3 text-center">
              Alejandro Scarlatti, San Borja 15037, Lima
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
