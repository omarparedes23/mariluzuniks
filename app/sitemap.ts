import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://www.unikssalonspa.pe'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tienda`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ]

  // Product pages
  const { data: products } = await supabase
    .from('uniks_productos')
    .select('id, updated_at')
    .eq('mostrar_en_tienda', true)

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
    url: `${baseUrl}/tienda/${product.id}`,
    lastModified: new Date(product.updated_at ?? Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Blog pages
  const { data: posts } = await supabase
    .from('uniks_blog_posts')
    .select('slug, updated_at')
    .eq('publicado', true)

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...blogPages]
}
