import { Award, Star, Heart, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ValorItem {
  icon: LucideIcon
  label: string
}

const valores: ValorItem[] = [
  { icon: Award, label: 'Profesionales Certificadas' },
  { icon: Star, label: 'Productos Premium' },
  { icon: Heart, label: 'Ambiente Acogedor' },
  { icon: ShieldCheck, label: 'Resultados Garantizados' },
]

export default function ValoresStrip() {
  return (
    <section
      className="bg-card border-y border-gold/15 py-6"
      aria-label="Nuestros valores"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ul
          className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4"
          role="list"
        >
          {valores.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 group"
            >
              <span
                className="w-9 h-9 flex items-center justify-center border border-gold/30 text-gold group-hover:bg-gold/10 transition-colors duration-300 shrink-0"
                aria-hidden="true"
              >
                <Icon size={16} />
              </span>
              <span className="font-sans text-sm text-cream/70 tracking-wide">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
