'use server'

import { createClient } from '@/lib/supabase/server'
import type { Producto } from '@/types/admin'

export type PublicProducto = Pick<Producto, 'id' | 'nombre' | 'precio' | 'precio_publico' | 'imagen_url_r2' | 'descripcion' | 'stock' | 'stock_minimo'>

export async function getPublicProducts(): Promise<PublicProducto[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_productos')
    .select('id, nombre, precio, precio_publico, imagen_url_r2, descripcion, stock, stock_minimo')
    .eq('mostrar_en_tienda', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching public products:', error)
    return []
  }

  return data || []
}

export async function getPublicProductById(id: string): Promise<PublicProducto | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_productos')
    .select('id, nombre, precio, precio_publico, imagen_url_r2, descripcion, stock, stock_minimo')
    .eq('id', id)
    .eq('mostrar_en_tienda', true)
    .single()

  if (error) {
    console.error('Error fetching public product:', error)
    return null
  }

  return data
}
