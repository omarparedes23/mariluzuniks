import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/Footer'
import { getPostBySlug } from '@/lib/actions/blog'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.titulo} | Uniks Salón & Spa`,
    description: post.resumen ?? undefined,
    openGraph: {
      title: post.titulo,
      description: post.resumen ?? undefined,
      images: post.imagen_url ? [post.imagen_url] : [],
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-bg">
      {/* Mini navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-[8px] border-b border-gold/10">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-3 group"
          >
            <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-serif text-lg text-gold tracking-wide">Blog</span>
          </Link>
          <Link href="/" className="font-sans text-xs tracking-[0.3em] uppercase text-gold/50 hover:text-gold transition-colors">
            Uniks
          </Link>
        </nav>
      </header>

      <article className="max-w-3xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        {/* Meta */}
        <p className="font-sans text-gold/50 text-[0.65rem] tracking-[0.5em] uppercase mb-6">
          {formatDate(post.created_at)}
        </p>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream leading-tight mb-6">
          {post.titulo}
        </h1>

        {/* Resumen */}
        {post.resumen && (
          <p className="font-sans text-cream/60 text-lg leading-relaxed mb-8 border-l-2 border-gold/40 pl-4">
            {post.resumen}
          </p>
        )}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-10" />

        {/* Hero image */}
        {post.imagen_url && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-10">
            <Image
              src={post.imagen_url}
              alt={post.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="font-sans text-cream/80 text-base leading-relaxed whitespace-pre-wrap">
          {post.contenido}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-10 border-t border-gold/10 text-center">
          <p className="font-serif text-xl text-cream/70 mb-2">
            ¿Quieres un servicio profesional?
          </p>
          <p className="text-muted text-sm mb-6">
            Visítanos en Scarlatti 208, San Borja · Lima, Perú
          </p>
          <a
            href="https://wa.me/51941719794"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300"
          >
            Reservar cita por WhatsApp
          </a>
        </div>
      </article>

      <Footer />
    </main>
  )
}
