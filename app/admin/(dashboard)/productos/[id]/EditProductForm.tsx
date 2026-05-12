'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateProduct, deleteProduct } from '@/lib/actions/products'
import type { Producto } from '@/types/admin'
import { ArrowLeft, Upload, Package, Trash2 } from 'lucide-react'

interface EditProductFormProps {
  product: Producto
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [removeImage, setRemoveImage] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    formData.append('removeImage', removeImage.toString())

    const result = await updateProduct(product.id, formData)

    if (result.success) {
      router.push('/admin/productos')
      router.refresh()
    } else {
      setError(result.error || 'Error al actualizar el producto')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      return
    }

    const result = await deleteProduct(product.id)

    if (result.success) {
      router.push('/admin/productos')
      router.refresh()
    } else {
      setError(result.error || 'Error al eliminar el producto')
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setRemoveImage(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const currentImage = removeImage ? null : (preview || product.imagen_url_r2)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/productos"
            className="p-2 text-muted hover:text-cream transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-cream">Editar Producto</h1>
            <p className="text-muted">Modifica los datos del producto</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
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
                {currentImage ? (
                  <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-muted" />
                )}
              </div>
              <div className="space-y-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors">
                  <Upload className="w-4 h-4" />
                  Cambiar imagen
                  <input
                    type="file"
                    name="imagen"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setRemoveImage(true)
                    setPreview(null)
                  }}
                  className="block text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Eliminar imagen
                </button>
                <p className="text-muted text-xs">JPG o PNG, máximo 5MB</p>
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
              defaultValue={product.nombre}
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
                defaultValue={product.stock}
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
                defaultValue={product.precio}
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
              {loading ? 'Guardando...' : 'Actualizar Producto'}
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
