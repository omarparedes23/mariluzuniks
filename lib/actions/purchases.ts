'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Compra, GastoTipoComprobante, GastoMetodoPago, ActionResult } from '@/types/admin'

const TIPOS_COMPROBANTE_VALIDOS: GastoTipoComprobante[] = ['factura', 'boleta', 'ticket', 'sin_comprobante']
const METODOS_PAGO_VALIDOS: GastoMetodoPago[] = ['efectivo', 'transferencia', 'yape']

export interface CompraItemInput {
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface CreateCompraInput {
  proveedor_id: string
  fecha: string
  tipo_comprobante: string
  numero_comprobante: string
  metodo_pago: string
  total: number
  notas: string
  items: CompraItemInput[]
}

export async function getCompras(filters?: {
  startDate?: string
  endDate?: string
  proveedorId?: string
}): Promise<Compra[]> {
  const supabase = await createClient()

  let query = supabase
    .from('uniks_compras')
    .select(`
      *,
      proveedor:uniks_proveedores(*),
      items:uniks_compra_items(
        *,
        producto:uniks_productos(id, nombre, codigo, stock)
      )
    `)
    .order('fecha', { ascending: false })

  if (filters?.startDate) query = query.gte('fecha', filters.startDate)
  if (filters?.endDate) query = query.lte('fecha', filters.endDate)
  if (filters?.proveedorId) query = query.eq('proveedor_id', filters.proveedorId)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching compras:', error)
    return []
  }
  return data || []
}

export async function getCompraById(id: string): Promise<Compra | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_compras')
    .select(`
      *,
      proveedor:uniks_proveedores(*),
      items:uniks_compra_items(
        *,
        producto:uniks_productos(id, nombre, codigo, stock)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching compra:', error)
    return null
  }
  return data
}

export async function createCompra(input: CreateCompraInput): Promise<ActionResult<Compra>> {
  const supabase = await createClient()

  if (!input.proveedor_id) {
    return { success: false, error: 'Selecciona un proveedor válido' }
  }
  if (!input.items || input.items.length === 0) {
    return { success: false, error: 'Agrega al menos un producto' }
  }
  if (!TIPOS_COMPROBANTE_VALIDOS.includes(input.tipo_comprobante as GastoTipoComprobante)) {
    return { success: false, error: 'Tipo de comprobante no válido' }
  }
  if (!METODOS_PAGO_VALIDOS.includes(input.metodo_pago as GastoMetodoPago)) {
    return { success: false, error: 'Método de pago no válido' }
  }
  for (const item of input.items) {
    if (!item.producto_id) return { success: false, error: 'Selecciona un producto en cada fila' }
    if (!item.cantidad || item.cantidad <= 0) return { success: false, error: 'La cantidad debe ser mayor a 0' }
    if (!item.precio_unitario || item.precio_unitario <= 0) return { success: false, error: 'El precio unitario debe ser mayor a 0' }
  }

  const { data: compra, error: compraError } = await supabase
    .from('uniks_compras')
    .insert({
      proveedor_id: input.proveedor_id,
      fecha: input.fecha,
      tipo_comprobante: input.tipo_comprobante as GastoTipoComprobante,
      numero_comprobante: input.numero_comprobante?.trim() || null,
      metodo_pago: input.metodo_pago as GastoMetodoPago,
      total: input.total,
      notas: input.notas?.trim() || null,
    })
    .select()
    .single()

  if (compraError || !compra) {
    console.error('Error creating compra:', compraError)
    return { success: false, error: 'Error al registrar la compra' }
  }

  const { error: itemsError } = await supabase
    .from('uniks_compra_items')
    .insert(
      input.items.map(item => ({
        compra_id: compra.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
      }))
    )

  if (itemsError) {
    console.error('Error creating compra items:', itemsError)
    await supabase.from('uniks_compras').delete().eq('id', compra.id)
    return { success: false, error: 'Error al registrar los productos de la compra' }
  }

  for (const item of input.items) {
    const { error: stockError } = await supabase.rpc('adjust_producto_stock', {
      p_producto_id: item.producto_id,
      p_delta: item.cantidad,
    })
    if (stockError) {
      console.error('Error updating stock for producto', item.producto_id, stockError)
    }
  }

  revalidatePath('/admin/compras')
  revalidatePath('/admin/productos')
  revalidatePath('/admin')
  return { success: true, data: compra }
}

export async function updateCompra(id: string, input: CreateCompraInput): Promise<ActionResult<Compra>> {
  const supabase = await createClient()

  if (!input.proveedor_id) return { success: false, error: 'Selecciona un proveedor válido' }
  if (!input.items || input.items.length === 0) return { success: false, error: 'Agrega al menos un producto' }
  if (!TIPOS_COMPROBANTE_VALIDOS.includes(input.tipo_comprobante as GastoTipoComprobante))
    return { success: false, error: 'Tipo de comprobante no válido' }
  if (!METODOS_PAGO_VALIDOS.includes(input.metodo_pago as GastoMetodoPago))
    return { success: false, error: 'Método de pago no válido' }
  for (const item of input.items) {
    if (!item.producto_id) return { success: false, error: 'Selecciona un producto en cada fila' }
    if (!item.cantidad || item.cantidad <= 0) return { success: false, error: 'La cantidad debe ser mayor a 0' }
    if (!item.precio_unitario || item.precio_unitario <= 0) return { success: false, error: 'El precio unitario debe ser mayor a 0' }
  }

  // Revertir stock de los items actuales
  const { data: existingItems } = await supabase
    .from('uniks_compra_items')
    .select('producto_id, cantidad')
    .eq('compra_id', id)

  for (const item of existingItems || []) {
    await supabase.rpc('adjust_producto_stock', {
      p_producto_id: item.producto_id,
      p_delta: -item.cantidad,
    })
  }

  // Borrar items actuales
  await supabase.from('uniks_compra_items').delete().eq('compra_id', id)

  // Actualizar header
  const { data: compra, error: updateError } = await supabase
    .from('uniks_compras')
    .update({
      proveedor_id: input.proveedor_id,
      fecha: input.fecha,
      tipo_comprobante: input.tipo_comprobante as GastoTipoComprobante,
      numero_comprobante: input.numero_comprobante?.trim() || null,
      metodo_pago: input.metodo_pago as GastoMetodoPago,
      total: input.total,
      notas: input.notas?.trim() || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError || !compra) {
    console.error('Error updating compra:', updateError)
    return { success: false, error: 'Error al actualizar la compra' }
  }

  // Insertar nuevos items
  const { error: itemsError } = await supabase
    .from('uniks_compra_items')
    .insert(
      input.items.map(item => ({
        compra_id: id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
      }))
    )

  if (itemsError) {
    console.error('Error inserting updated items:', itemsError)
    return { success: false, error: 'Error al actualizar los productos de la compra' }
  }

  // Aplicar stock de los nuevos items
  for (const item of input.items) {
    await supabase.rpc('adjust_producto_stock', {
      p_producto_id: item.producto_id,
      p_delta: item.cantidad,
    })
  }

  revalidatePath('/admin/compras')
  revalidatePath(`/admin/compras/${id}`)
  revalidatePath('/admin/productos')
  revalidatePath('/admin')
  return { success: true, data: compra }
}

export async function deleteCompra(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: compra, error: fetchError } = await supabase
    .from('uniks_compras')
    .select('fecha, items:uniks_compra_items(producto_id, cantidad)')
    .eq('id', id)
    .single()

  if (fetchError || !compra) {
    return { success: false, error: 'Compra no encontrada' }
  }

  const fechaCompra = new Date(compra.fecha)
  const diasDiferencia = Math.floor((Date.now() - fechaCompra.getTime()) / (1000 * 60 * 60 * 24))
  if (diasDiferencia >= 30) {
    return { success: false, error: 'No se puede eliminar compras con más de 30 días' }
  }

  for (const item of compra.items as { producto_id: string; cantidad: number }[]) {
    const { error: stockError } = await supabase.rpc('adjust_producto_stock', {
      p_producto_id: item.producto_id,
      p_delta: -item.cantidad,
    })
    if (stockError) {
      console.error('Error reverting stock for producto', item.producto_id, stockError)
    }
  }

  const { error } = await supabase.from('uniks_compras').delete().eq('id', id)
  if (error) {
    return { success: false, error: 'Error al eliminar la compra' }
  }

  revalidatePath('/admin/compras')
  revalidatePath('/admin/productos')
  revalidatePath('/admin')
  return { success: true }
}
