'use server'

import { createClient } from '@/lib/supabase/server'
import type { Producto } from '@/types/admin'

export interface PublicProducto extends Pick<Producto, 'id' | 'nombre' | 'precio' | 'imagen_url_r2' | 'descripcion'> {
  stock: number
}

export async function getPublicProducts(): Promise<PublicProducto[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_productos')
    .select('id, nombre, precio, imagen_url_r2, descripcion, stock')
    .gt('stock', 0)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching public products:', error)
    return []
  }

  return data || []
}
