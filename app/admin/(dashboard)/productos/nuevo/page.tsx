'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/lib/actions/products'
import { ArrowLeft, Upload, Package } from 'lucide-react'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const result = await createProduct(formData)

    if (result.success) {
      router.push('/admin/productos')
      router.refresh()
    } else {
      setError(result.error || 'Error al crear el producto')
      setLoading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/productos"
          className="p-2 text-muted hover:text-cream transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream">Nuevo Producto</h1>
          <p className="text-muted">Agrega un producto al inventario</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm text-cream/80 mb-2">Imagen del producto</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 bg-bg rounded-lg border border-gold/30 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-muted" />
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors">
                  <Upload className="w-4 h-4" />
                  Subir imagen
                  <input
                    type="file"
                    name="imagen"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-muted text-xs mt-2">JPG o PNG, máximo 5MB</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="nombre" className="block text-sm text-cream/80 mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
              placeholder="Ej: Shampoo Keratina"
            />
          </div>

          {/* Stock and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm text-cream/80 mb-2">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="0"
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="precio" className="block text-sm text-cream/80 mb-2">
                Precio (S/) *
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                required
                min="0"
                step="0.01"
                className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
            <Link
              href="/admin/productos"
              className="text-muted hover:text-cream transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
