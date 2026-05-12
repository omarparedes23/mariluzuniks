'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { uploadImage, deleteImage, extractKeyFromUrl } from '@/lib/r2/client'
import type { Producto, ActionResult } from '@/types/admin'

export async function getProducts(): Promise<Producto[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('uniks_productos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProduct(id: string): Promise<Producto | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('uniks_productos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function createProduct(formData: FormData): Promise<ActionResult<Producto>> {
  const supabase = await createClient()
  
  const nombre = formData.get('nombre') as string
  const stock = parseInt(formData.get('stock') as string)
  const precio = parseFloat(formData.get('precio') as string)
  const imagen = formData.get('imagen') as File

  let imagen_url_r2: string | null = null

  // Upload image if provided
  if (imagen && imagen.size > 0) {
    const uploadResult = await uploadImage(imagen)
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }
    imagen_url_r2 = uploadResult.url || null
  }

  const { data, error } = await supabase
    .from('uniks_productos')
    .insert({
      nombre,
      stock,
      precio,
      imagen_url_r2,
    })
    .select()
    .single()

  if (error) {
    // Cleanup image if database insert failed
    if (imagen_url_r2) {
      const key = extractKeyFromUrl(imagen_url_r2)
      if (key) await deleteImage(key)
    }
    return { success: false, error: 'Error al crear el producto' }
  }

  revalidatePath('/admin/productos')
  return { success: true, data }
}

export async function updateProduct(id: string, formData: FormData): Promise<ActionResult<Producto>> {
  const supabase = await createClient()
  
  const nombre = formData.get('nombre') as string
  const stock = parseInt(formData.get('stock') as string)
  const precio = parseFloat(formData.get('precio') as string)
  const imagen = formData.get('imagen') as File
  const removeImage = formData.get('removeImage') === 'true'

  // Get current product to check for old image
  const { data: currentProduct } = await supabase
    .from('uniks_productos')
    .select('imagen_url_r2')
    .eq('id', id)
    .single()

  let imagen_url_r2: string | null = currentProduct?.imagen_url_r2 || null

  // Handle image removal
  if (removeImage && imagen_url_r2) {
    const key = extractKeyFromUrl(imagen_url_r2)
    if (key) await deleteImage(key)
    imagen_url_r2 = null
  }

  // Handle new image upload
  if (imagen && imagen.size > 0) {
    const uploadResult = await uploadImage(imagen)
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error }
    }
    
    // Delete old image if exists
    if (currentProduct?.imagen_url_r2) {
      const oldKey = extractKeyFromUrl(currentProduct.imagen_url_r2)
      if (oldKey) await deleteImage(oldKey)
    }
    
    imagen_url_r2 = uploadResult.url || null
  }

  const { data, error } = await supabase
    .from('uniks_productos')
    .update({
      nombre,
      stock,
      precio,
      imagen_url_r2,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { success: false, error: 'Error al actualizar el producto' }
  }

  revalidatePath('/admin/productos')
  return { success: true, data }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  
  // Get product to delete image
  const { data: product } = await supabase
    .from('uniks_productos')
    .select('imagen_url_r2')
    .eq('id', id)
    .single()

  // Delete image from R2 if exists
  if (product?.imagen_url_r2) {
    const key = extractKeyFromUrl(product.imagen_url_r2)
    if (key) await deleteImage(key)
  }

  const { error } = await supabase
    .from('uniks_productos')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: 'Error al eliminar el producto' }
  }

  revalidatePath('/admin/productos')
  return { success: true }
}
