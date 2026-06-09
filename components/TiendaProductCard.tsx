'use client'

import Image from 'next/image'
import { Package } from 'lucide-react'
import type { PublicProducto } from '@/lib/actions/tienda'
import { motion } from 'framer-motion'

interface TiendaProductCardProps {
  product: PublicProducto
  index: number
}

export default function TiendaProductCard({ product, index }: TiendaProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-card border border-gold/15 rounded-lg overflow-hidden hover:border-gold/40 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-square bg-bg overflow-hidden">
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

        {/* Gold shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors duration-300 line-clamp-1">
          {product.nombre}
        </h3>

        {product.descripcion && (
          <p className="text-muted text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
          <span className="font-serif text-xl text-gold">
            S/ {Number(product.precio).toFixed(2)}
          </span>
          <span className="text-xs text-muted/60 tracking-widest uppercase">
            Disponible
          </span>
        </div>
      </div>
    </motion.div>
  )
}
