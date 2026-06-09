import Footer from '@/components/Footer'
import TiendaProductCard from '@/components/TiendaProductCard'
import { getPublicProducts } from '@/lib/actions/tienda'
import { Package, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Tienda | Uniks Salón & Spa',
  description: 'Explora nuestros productos de belleza y cuidado personal. Envíos a todo Lima.',
}

export default async function TiendaPage() {
  const products = await getPublicProducts()

  return (
    <main className="min-h-screen bg-bg">
      {/* Mini navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-[8px] border-b border-gold/10">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-serif text-lg text-gold tracking-wide">Uniks</span>
          </Link>

          <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold/50">
            Tienda
          </span>
        </nav>
      </header>

      {/* Hero section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto text-center">
          <p className="font-sans text-gold/60 text-[0.7rem] tracking-[0.5em] uppercase mb-4">
            Productos de belleza
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream leading-tight mb-4">
            Nuestra{' '}
            <span className="text-gold italic">Tienda</span>
          </h1>

          {/* Decorative gold line */}
          <div className="mx-auto my-6 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <p className="font-sans text-cream/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Productos seleccionados para el cuidado de tu cabello y piel.
            <br className="hidden sm:block" />
            <span className="text-gold/50">Calidad profesional que puedes llevar a casa.</span>
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <TiendaProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Package className="w-16 h-16 mx-auto mb-6 text-muted/30" />
            <h2 className="font-serif text-2xl text-cream/60 mb-3">
              Próximamente
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Estamos preparando nuestros productos para ti.
              <br />
              Mientras tanto, puedes reservar nuestros servicios por WhatsApp.
            </p>
            <a
              href="https://wa.me/51941719794"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 font-sans text-xs tracking-widest uppercase px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
            >
              Reservar por WhatsApp
            </a>
          </div>
        )}

        {/* Bottom CTA */}
        {products.length > 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8" />
            <p className="text-muted text-sm mb-4">
              ¿No encontraste lo que buscas?
            </p>
            <a
              href="https://wa.me/51941719794"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
            >
              Contáctanos por WhatsApp
            </a>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
