'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadImage, deleteImage, extractKeyFromUrl } from '@/lib/r2/client'
import type { BlogPost, ActionResult } from '@/types/admin'

export async function getPublicPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('uniks_blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('uniks_blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()
  if (error) return null
  return data
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('uniks_blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('uniks_blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function createPost(formData: FormData): Promise<ActionResult<BlogPost>> {
  const supabase = await createClient()

  const titulo = formData.get('titulo') as string
  const slug = formData.get('slug') as string
  const resumen = (formData.get('resumen') as string)?.trim() || null
  const contenido = formData.get('contenido') as string
  const publicado = formData.get('publicado') === 'on'
  const imagen = formData.get('imagen') as File

  let imagen_url: string | null = null
  if (imagen && imagen.size > 0) {
    const result = await uploadImage(imagen)
    if (!result.success) return { success: false, error: result.error }
    imagen_url = result.url || null
  }

  const { data, error } = await supabase
    .from('uniks_blog_posts')
    .insert({ titulo, slug, resumen, contenido, imagen_url, publicado })
    .select()
    .single()

  if (error) {
    if (imagen_url) {
      const key = extractKeyFromUrl(imagen_url)
      if (key) await deleteImage(key)
    }
    if (error.code === '23505') return { success: false, error: 'Ya existe un post con ese slug.' }
    return { success: false, error: 'Error al crear el post' }
  }

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true, data }
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult<BlogPost>> {
  const supabase = await createClient()

  const titulo = formData.get('titulo') as string
  const slug = formData.get('slug') as string
  const resumen = (formData.get('resumen') as string)?.trim() || null
  const contenido = formData.get('contenido') as string
  const publicado = formData.get('publicado') === 'on'
  const imagen = formData.get('imagen') as File
  const removeImage = formData.get('removeImage') === 'true'

  const { data: current } = await supabase
    .from('uniks_blog_posts')
    .select('imagen_url')
    .eq('id', id)
    .single()

  let imagen_url: string | null = current?.imagen_url || null

  if (removeImage && imagen_url) {
    const key = extractKeyFromUrl(imagen_url)
    if (key) await deleteImage(key)
    imagen_url = null
  }

  if (imagen && imagen.size > 0) {
    const result = await uploadImage(imagen)
    if (!result.success) return { success: false, error: result.error }
    if (current?.imagen_url) {
      const oldKey = extractKeyFromUrl(current.imagen_url)
      if (oldKey) await deleteImage(oldKey)
    }
    imagen_url = result.url || null
  }

  const { data, error } = await supabase
    .from('uniks_blog_posts')
    .update({ titulo, slug, resumen, contenido, imagen_url, publicado })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return { success: false, error: 'Ya existe un post con ese slug.' }
    return { success: false, error: 'Error al actualizar el post' }
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin/blog')
  return { success: true, data }
}

export async function deletePost(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('uniks_blog_posts')
    .select('imagen_url')
    .eq('id', id)
    .single()

  if (post?.imagen_url) {
    const key = extractKeyFromUrl(post.imagen_url)
    if (key) await deleteImage(key)
  }

  const { error } = await supabase
    .from('uniks_blog_posts')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: 'Error al eliminar el post' }

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true }
}
