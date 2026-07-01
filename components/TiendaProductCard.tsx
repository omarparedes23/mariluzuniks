'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'
import type { PublicProducto } from '@/lib/actions/tienda'
import { motion } from 'framer-motion'

interface TiendaProductCardProps {
  product: PublicProducto
  index: number
}

const WA_NUMBER = '51941719794'

function getWhatsAppUrl(product: PublicProducto) {
  const price = Number(product.precio_publico ?? product.precio).toFixed(2)
  const text = `¡Hola! Me gustaría comprar el producto:%0A%0A✨ *${product.nombre}*%0A💰 S/ ${price}%0A%0A¿Podrían darme más información?`
  return `https://wa.me/${WA_NUMBER}?text=${text}`
}

function getStockLabel(stock: number, stockMinimo: number) {
  if (stock <= 0) return { label: 'Agotado', className: 'text-red-400/60' }
  if (stock <= stockMinimo) return { label: `Stock bajo — ${stock} ud.`, className: 'text-amber-400/60' }
  return { label: `${stock} ud. disponibles`, className: 'text-emerald-400/60' }
}

export default function TiendaProductCard({ product, index }: TiendaProductCardProps) {
  const stockInfo = getStockLabel(product.stock, product.stock_minimo)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-card border border-gold/15 rounded-lg overflow-hidden hover:border-gold/40 transition-all duration-500"
    >
      {/* Image — clickable to detail */}
      <Link href={`/tienda/${product.id}`} className="relative aspect-square bg-bg overflow-hidden block">
        {product.imagen_url_r2 ? (
          <Image
            src={product.imagen_url_r2}
            alt={product.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted/40" />
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* View detail label on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="font-sans text-xs tracking-widest uppercase px-5 py-2 border border-gold text-gold backdrop-blur-sm bg-black/30">
            Ver detalle
          </span>
        </div>

        {/* WhatsApp button — top-right, visible on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            window.open(getWhatsAppUrl(product), '_blank', 'noopener,noreferrer')
          }}
          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-400 hover:scale-110 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label={`Consultar ${product.nombre} por WhatsApp`}
          title="Consultar por WhatsApp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="p-5">
        <Link href={`/tienda/${product.id}`} className="block">
          <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors duration-300 line-clamp-1">
            {product.nombre}
          </h3>
        </Link>

        {product.descripcion && (
          <p className="text-muted text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
          <span className="font-serif text-xl text-gold">
            S/ {Number(product.precio_publico ?? product.precio).toFixed(2)}
          </span>
          <span className={`text-xs tracking-widest uppercase ${stockInfo.className}`}>
            {stockInfo.label}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
