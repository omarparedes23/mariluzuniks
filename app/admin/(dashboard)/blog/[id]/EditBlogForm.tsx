'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, BookOpen, Trash2 } from 'lucide-react'
import { updatePost, deletePost } from '@/lib/actions/blog'
import type { BlogPost } from '@/types/admin'

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

export default function EditBlogForm({ post }: { post: BlogPost }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [titulo, setTitulo] = useState(post.titulo)
  const [slug, setSlug] = useState(post.slug)

  const currentImage = removeImage ? null : (preview || post.imagen_url)

  function handleTituloChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setTitulo(val)
    setSlug(toSlug(val))
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

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    formData.append('removeImage', removeImage.toString())
    const result = await updatePost(post.id, formData)
    if (result.success) {
      router.push('/admin/blog')
      router.refresh()
    } else {
      setError(result.error || 'Error al actualizar el post')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este post? Esta acción no se puede deshacer.')) return
    const result = await deletePost(post.id)
    if (result.success) {
      router.push('/admin/blog')
      router.refresh()
    } else {
      setError(result.error || 'Error al eliminar el post')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 text-muted hover:text-cream transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-cream">Editar Post</h1>
            <p className="text-muted">Modifica el contenido del post</p>
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

      <form action={handleSubmit} className="max-w-3xl">
        <div className="bg-card border border-gold/20 rounded-lg p-6 space-y-6">

          {/* Imagen */}
          <div>
            <label className="block text-sm text-cream/80 mb-2">Imagen de portada</label>
            <div className="flex items-center gap-4">
              <div className="w-40 h-24 bg-bg rounded-lg border border-gold/30 flex items-center justify-center overflow-hidden">
                {currentImage ? (
                  <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-8 h-8 text-muted" />
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
                  onClick={() => { setRemoveImage(true); setPreview(null) }}
                  className="block text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Eliminar imagen
                </button>
              </div>
            </div>
          </div>

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm text-cream/80 mb-2">Título *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              value={titulo}
              onChange={handleTituloChange}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
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
              />
            </div>
          </div>

          {/* Resumen */}
          <div>
            <label htmlFor="resumen" className="block text-sm text-cream/80 mb-2">
              Resumen <span className="text-muted font-normal">(opcional)</span>
            </label>
            <textarea
              id="resumen"
              name="resumen"
              rows={2}
              defaultValue={post.resumen ?? ''}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Contenido */}
          <div>
            <label htmlFor="contenido" className="block text-sm text-cream/80 mb-2">Contenido *</label>
            <textarea
              id="contenido"
              name="contenido"
              rows={16}
              required
              defaultValue={post.contenido}
              className="w-full bg-bg border border-gold/30 rounded px-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors resize-y font-sans text-sm leading-relaxed"
            />
          </div>

          {/* Publicado */}
          <div className="flex items-start gap-3 p-4 bg-bg rounded-lg border border-gold/20">
            <input
              type="checkbox"
              id="publicado"
              name="publicado"
              defaultChecked={post.publicado}
              className="mt-0.5 w-4 h-4 accent-[var(--color-gold)] cursor-pointer"
            />
            <div>
              <label htmlFor="publicado" className="text-sm text-cream/80 cursor-pointer font-medium">
                Publicado
              </label>
              <p className="text-muted text-xs mt-0.5">
                Desmarca para convertirlo en borrador y ocultarlo del blog.
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
              {loading ? 'Guardando...' : 'Actualizar Post'}
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
