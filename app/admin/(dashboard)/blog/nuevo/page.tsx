'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, BookOpen } from 'lucide-react'
import { createPost } from '@/lib/actions/blog'

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function NuevoBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [slug, setSlug] = useState('')

  function handleTituloChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setTitulo(val)
    setSlug(toSlug(val))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await createPost(formData)
    if (result.success) {
      router.push('/admin/blog')
      router.refresh()
    } else {
      setError(result.error || 'Error al crear el post')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 text-muted hover:text-cream transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream">Nuevo Post</h1>
          <p className="text-muted">Crea una nueva entrada del blog</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="max-w-3xl">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-6">

          {/* Imagen portada */}
          <div>
            <label className="block text-sm text-cream/80 mb-2">Imagen de portada</label>
            <div className="flex items-center gap-4">
              <div className="w-40 h-24 bg-bg rounded-lg border border-gold/30 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-8 h-8 text-muted" />
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

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm text-cream/80 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              value={titulo}
              onChange={handleTituloChange}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
              placeholder="Ej: 5 consejos para el cuidado del cabello"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm text-cream/80 mb-2">
              Slug <span className="text-muted font-normal">(URL del post)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm">/blog/</span>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors font-mono text-sm"
                placeholder="mi-post-de-ejemplo"
              />
            </div>
            <p className="text-muted text-xs mt-1">Se genera solo desde el título, pero puedes ajustarlo</p>
          </div>

          {/* Resumen */}
          <div>
            <label htmlFor="resumen" className="block text-sm text-cream/80 mb-2">
              Resumen <span className="text-muted font-normal">(opcional — aparece en la tarjeta)</span>
            </label>
            <textarea
              id="resumen"
              name="resumen"
              rows={2}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
              placeholder="Una breve descripción del post para los lectores..."
            />
          </div>

          {/* Contenido */}
          <div>
            <label htmlFor="contenido" className="block text-sm text-cream/80 mb-2">
              Contenido *
            </label>
            <textarea
              id="contenido"
              name="contenido"
              rows={16}
              required
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-y font-sans text-sm leading-relaxed"
              placeholder="Escribe el contenido completo del post aquí..."
            />
            <p className="text-muted text-xs mt-1">Los saltos de línea se respetan en la publicación</p>
          </div>

          {/* Publicado */}
          <div className="flex items-start gap-3 p-4 bg-bg rounded-lg border border-gold/20">
            <input
              type="checkbox"
              id="publicado"
              name="publicado"
              className="mt-0.5 w-4 h-4 accent-[var(--color-gold)] cursor-pointer"
            />
            <div>
              <label htmlFor="publicado" className="text-sm text-cream/80 cursor-pointer font-medium">
                Publicar ahora
              </label>
              <p className="text-muted text-xs mt-0.5">
                Si no marcas esto, el post se guarda como borrador y no es visible en el blog.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Post'}
            </button>
            <Link href="/admin/blog" className="text-muted hover:text-cream transition-colors">
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
