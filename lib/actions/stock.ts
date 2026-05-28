'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { AjusteStock, ActionResult } from '@/types/admin'

export async function createAjuste(
  producto_id: string,
  stock_nuevo: number,
  motivo: string
): Promise<ActionResult<AjusteStock>> {
  const supabase = await createClient()

  if (!producto_id) {
    return { success: false, error: 'Selecciona un producto' }
  }
  if (isNaN(stock_nuevo) || stock_nuevo < 0) {
    return { success: false, error: 'El stock debe ser un número mayor o igual a 0' }
  }

  const { data: producto, error: fetchError } = await supabase
    .from('uniks_productos')
    .select('stock')
    .eq('id', producto_id)
    .single()

  if (fetchError || !producto) {
    return { success: false, error: 'Producto no encontrado' }
  }

  const stock_anterior = producto.stock

  const { data: ajuste, error: ajusteError } = await supabase
    .from('uniks_ajustes_stock')
    .insert({
      producto_id,
      stock_anterior,
      stock_nuevo,
      motivo: motivo?.trim() || null,
      fecha: new Date().toISOString().slice(0, 10),
    })
    .select()
    .single()

  if (ajusteError || !ajuste) {
    console.error('Error creating ajuste:', ajusteError)
    return { success: false, error: 'Error al registrar el ajuste' }
  }

  const { error: updateError } = await supabase
    .from('uniks_productos')
    .update({ stock: stock_nuevo })
    .eq('id', producto_id)

  if (updateError) {
    console.error('Error updating stock after ajuste:', updateError)
    await supabase.from('uniks_ajustes_stock').delete().eq('id', ajuste.id)
    return { success: false, error: 'Error al actualizar el stock' }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/admin')
  return { success: true, data: ajuste }
}

export async function getAjustesByProduct(producto_id: string): Promise<AjusteStock[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_ajustes_stock')
    .select('*, producto:uniks_productos(id, nombre, codigo)')
    .eq('producto_id', producto_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching ajustes:', error)
    return []
  }
  return data || []
}

export async function getAllAjustes(): Promise<AjusteStock[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_ajustes_stock')
    .select('*, producto:uniks_productos(id, nombre, codigo)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching ajustes:', error)
    return []
  }
  return data || []
}
