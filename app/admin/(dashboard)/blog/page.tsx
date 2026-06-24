import Link from 'next/link'
import { Plus, BookOpen, Eye, EyeOff } from 'lucide-react'
import { getAllPosts } from '@/lib/actions/blog'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function AdminBlogPage() {
  const posts = await getAllPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream">Blog</h1>
          <p className="text-muted">{posts.length} {posts.length === 1 ? 'entrada' : 'entradas'}</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="flex items-center gap-2 bg-gold text-black px-4 py-2.5 rounded font-medium hover:bg-gold-light transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted/30" />
          <p className="text-muted">No hay entradas todavía.</p>
          <Link href="/admin/blog/nuevo" className="inline-block mt-4 text-gold hover:underline text-sm">
            Crear el primer post
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left px-6 py-4 text-xs text-muted uppercase tracking-wider">Título</th>
                <th className="text-left px-6 py-4 text-xs text-muted uppercase tracking-wider hidden sm:table-cell">Estado</th>
                <th className="text-left px-6 py-4 text-xs text-muted uppercase tracking-wider hidden md:table-cell">Fecha</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gold/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-cream font-medium line-clamp-1">{post.titulo}</p>
                    <p className="text-muted text-xs mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
                      post.publicado
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-muted/10 text-muted'
                    }`}>
                      {post.publicado ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {post.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted text-sm hidden md:table-cell">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-gold hover:text-gold-light text-sm transition-colors"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
