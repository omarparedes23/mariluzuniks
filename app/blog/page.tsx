import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Footer from '@/components/Footer'
import { getPublicPosts } from '@/lib/actions/blog'

export const metadata = {
  title: 'Blog | Uniks Salón & Spa',
  description: 'Consejos de belleza, cuidado capilar y tendencias del mundo del salón. Por el equipo de Uniks Salón & Spa en San Borja, Lima.',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getPublicPosts()

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
            Blog
          </span>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="font-sans text-gold/60 text-[0.7rem] tracking-[0.5em] uppercase mb-4">
            Consejos & tendencias
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream leading-tight mb-4">
            Nuestro{' '}
            <span className="text-gold italic">Blog</span>
          </h1>
          <div className="mx-auto my-6 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <p className="font-sans text-cream/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Tips de belleza, cuidado capilar y todo lo que necesitas saber
            <br className="hidden sm:block" />
            <span className="text-gold/50">para lucir increíble cada día.</span>
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-card border border-gold/15 rounded-lg overflow-hidden hover:border-gold/40 transition-all duration-500 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-video bg-bg overflow-hidden">
                  {post.imagen_url ? (
                    <Image
                      src={post.imagen_url}
                      alt={post.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-muted/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="font-sans text-gold/50 text-[0.65rem] tracking-[0.4em] uppercase mb-3">
                    {formatDate(post.created_at)}
                  </p>
                  <h2 className="font-serif text-xl text-cream group-hover:text-gold transition-colors duration-300 leading-snug mb-3">
                    {post.titulo}
                  </h2>
                  {post.resumen && (
                    <p className="text-muted text-sm leading-relaxed line-clamp-3 flex-1">
                      {post.resumen}
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-gold/10">
                    <span className="font-sans text-xs text-gold/60 tracking-widest uppercase group-hover:text-gold transition-colors duration-300">
                      Leer más →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-muted/30" />
            <h2 className="font-serif text-2xl text-cream/60 mb-3">Próximamente</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Estamos preparando contenido sobre belleza y cuidado capilar para ti.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
