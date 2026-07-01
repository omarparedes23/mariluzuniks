import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import { getPublicProductById } from '@/lib/actions/tienda'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

const WA_NUMBER = '51941719794'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getPublicProductById(id)
  if (!product) return {}
  return {
    title: `${product.nombre} | Uniks Salón & Spa`,
    description: product.descripcion ?? `Compra ${product.nombre} — calidad profesional Uniks Salón & Spa. Envíos a todo Lima.`,
    openGraph: {
      title: `${product.nombre} | Uniks Salón & Spa`,
      description: product.descripcion ?? `Compra ${product.nombre} — calidad profesional.`,
      images: product.imagen_url_r2 ? [product.imagen_url_r2] : [],
    },
  }
}

function getStockInfo(stock: number, stockMinimo: number) {
  if (stock <= 0) {
    return {
      label: 'Agotado',
      description: 'Este producto no está disponible por el momento.',
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/20',
      Icon: XCircle,
    }
  }
  if (stock <= stockMinimo) {
    return {
      label: 'Stock bajo',
      description: `Quedan ${stock} unidad${stock !== 1 ? 'es' : ''} — ¡adquiérelo pronto!`,
      detail: `${stock} ud.`,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
      Icon: AlertTriangle,
    }
  }
  return {
    label: 'En stock',
    description: `Tenemos ${stock} unidad${stock !== 1 ? 'es' : ''} disponibles.`,
    detail: `${stock} ud.`,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    Icon: CheckCircle,
  }
}

function getWhatsAppUrl(product: {
  nombre: string
  precio: number
  precio_publico: number | null
}) {
  const price = Number(product.precio_publico ?? product.precio).toFixed(2)
  const text = `¡Hola! Me gustaría comprar el producto:%0A%0A✨ *${product.nombre}*%0A💰 S/ ${price}%0A%0A¿Podrían darme más información sobre disponibilidad y envío?`
  return `https://wa.me/${WA_NUMBER}?text=${text}`
}

function productSchema(product: {
  nombre: string
  descripcion: string | null
  precio: number
  precio_publico: number | null
  stock: number
  imagen_url_r2: string | null
}) {
  const price = Number(product.precio_publico ?? product.precio).toFixed(2)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion ?? undefined,
    image: product.imagen_url_r2 ?? undefined,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'PEN',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await getPublicProductById(id)

  if (!product) notFound()

  const stockInfo = getStockInfo(product.stock, product.stock_minimo)
  const { Icon } = stockInfo
  const price = Number(product.precio_publico ?? product.precio).toFixed(2)

  const jsonLd = productSchema(product)

  return (
    <main className="min-h-screen bg-bg">
      {/* Schema.org Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Mini navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-[8px] border-b border-gold/10">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/tienda"
            className="flex items-center gap-3 group"
            aria-label="Volver a la tienda"
          >
            <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-serif text-lg text-gold tracking-wide">Tienda</span>
          </Link>
          <Link
            href="/"
            className="font-sans text-xs tracking-[0.3em] uppercase text-gold/50 hover:text-gold transition-colors"
          >
            Uniks
          </Link>
        </nav>
      </header>

      {/* Product detail */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-gold/15">
            {product.imagen_url_r2 ? (
              <Image
                src={product.imagen_url_r2}
                alt={product.nombre}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-muted/30" />
              </div>
            )}

            {/* Subtle gradient at bottom for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Stock badge — top-left */}
            <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${stockInfo.bg} backdrop-blur-sm`}>
              <Icon className={`w-3.5 h-3.5 ${stockInfo.color}`} />
              <span className={`font-sans text-[0.65rem] tracking-widest uppercase ${stockInfo.color}`}>
                {stockInfo.label}{stockInfo.detail ? ` · ${stockInfo.detail}` : ''}
              </span>
            </div>
          </div>

          {/* Right — Info */}
          <div className="flex flex-col gap-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-muted/50 font-sans" aria-label="Breadcrumb">
              <Link href="/tienda" className="hover:text-gold transition-colors">Tienda</Link>
              <span aria-hidden="true">/</span>
              <span className="text-cream/40 truncate max-w-[200px]">{product.nombre}</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream leading-tight">
              {product.nombre}
            </h1>

            {/* Divider */}
            <div className="w-20 h-px bg-gold/40" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl sm:text-5xl text-gold">
                S/ {price}
              </span>
              {product.precio_publico && product.precio_publico !== product.precio && (
                <span className="font-sans text-lg text-muted/50 line-through">
                  S/ {Number(product.precio).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock info */}
            <div className={`flex items-start gap-3 p-4 rounded-lg border ${stockInfo.bg}`}>
              <Icon className={`w-5 h-5 ${stockInfo.color} mt-0.5 shrink-0`} />
              <div>
                <p className={`font-sans text-sm font-medium ${stockInfo.color}`}>
                  {stockInfo.label}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {stockInfo.description}
                </p>
              </div>
            </div>

            {/* Description */}
            {product.descripcion && (
              <>
                <div className="w-full h-px bg-gold/10" />
                <div>
                  <h2 className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-gold/50 mb-3">
                    Descripción
                  </h2>
                  <p className="font-sans text-cream/70 text-base leading-relaxed whitespace-pre-wrap">
                    {product.descripcion}
                  </p>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-gold/20 via-gold/40 to-transparent" />

            {/* WhatsApp CTA */}
            <div className="bg-card border border-gold/15 rounded-xl p-6">
              <p className="font-serif text-xl text-cream/80 mb-1">
                ¿Te interesa este producto?
              </p>
              <p className="text-muted text-sm mb-5">
                Escríbenos por WhatsApp para resolver tus dudas y realizar tu pedido.
              </p>
              <a
                href={getWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto font-sans text-sm tracking-widest uppercase px-8 py-4 bg-green-500 text-white hover:bg-green-400 active:bg-green-600 transition-all duration-300 rounded-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-card/50 border border-gold/10 rounded-lg p-4">
                <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold/40 mb-1">
                  Envío
                </p>
                <p className="font-sans text-sm text-cream/60">
                  Consulta cobertura y tarifas
                </p>
              </div>
              <div className="bg-card/50 border border-gold/10 rounded-lg p-4">
                <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold/40 mb-1">
                  Pago
                </p>
                <p className="font-sans text-sm text-cream/60">
                  Yape, transferencia o efectivo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8" />
          <p className="font-serif text-2xl text-cream/60 mb-2">
            ¿No es lo que buscabas?
          </p>
          <p className="text-muted text-sm mb-6">
            Explora todos nuestros productos disponibles.
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
          >
            Ver todos los productos
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
