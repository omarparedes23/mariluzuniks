'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  ActionResult,
  ControlSesion,
  ControlItem,
  ControlSesionConItems,
  ControlResumen,
  CreateControlSesionInput,
} from '@/types/admin'
import { getPaymentSummary } from '@/lib/actions/payments'

// ============================================================
// Helpers
// ============================================================

function limaRange(fecha_inicio: string, fecha_fin: string) {
  return {
    startDate: `${fecha_inicio}T00:00:00-05:00`,
    endDate: `${fecha_fin}T23:59:59-05:00`,
  }
}

// ============================================================
// createControlSesion
// ============================================================

export async function createControlSesion(
  input: CreateControlSesionInput
): Promise<ActionResult<ControlSesion>> {
  const supabase = await createClient()

  // 1. Check no existing borrador
  const { data: existingBorrador } = await supabase
    .from('uniks_control_sesiones')
    .select('id')
    .eq('estado', 'borrador')
    .limit(1)
    .maybeSingle()

  if (existingBorrador) {
    return {
      success: false,
      error: 'Ya existe un control en borrador. Ciérralo antes de crear uno nuevo.',
    }
  }

  // 2. Validate fecha_fin >= fecha_inicio
  if (input.fecha_fin < input.fecha_inicio) {
    return {
      success: false,
      error: 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
    }
  }

  // 3. Insert new session
  const { data: sesion, error: sesionError } = await supabase
    .from('uniks_control_sesiones')
    .insert({
      fecha_inicio: input.fecha_inicio,
      fecha_fin: input.fecha_fin,
      notas: input.notas?.trim() || null,
      estado: 'borrador',
    })
    .select()
    .single()

  if (sesionError || !sesion) {
    console.error('Error creating control sesion:', sesionError)
    return { success: false, error: 'Error al crear la sesión de control.' }
  }

  // 4. Fetch all products
  const { data: productos, error: productosError } = await supabase
    .from('uniks_productos')
    .select('id, stock, precio_costo')
    .order('nombre', { ascending: true })

  if (productosError) {
    console.error('Error fetching productos:', productosError)
    await supabase.from('uniks_control_sesiones').delete().eq('id', sesion.id)
    return { success: false, error: 'Error al obtener los productos.' }
  }

  // 5. Pre-compute expected stock per product (stock_anterior + compras + ajustes del período)
  //    so the grid opens pre-filled and Mariluz only corrects differences.
  const enrichedProducts = await Promise.all(
    (productos ?? []).map(async (p) => {
      const [comprasRes, ajustesRes] = await Promise.all([
        supabase.rpc('get_compras_en_periodo', {
          p_producto_id: p.id,
          p_inicio: input.fecha_inicio,
          p_fin: input.fecha_fin,
        }),
        supabase.rpc('get_ajustes_en_periodo', {
          p_producto_id: p.id,
          p_inicio: input.fecha_inicio,
          p_fin: input.fecha_fin,
        }),
      ])
      const compras = (comprasRes.data as number) ?? 0
      const ajustes = (ajustesRes.data as number) ?? 0
      return {
        id: p.id,
        stock: p.stock,
        precio_costo: p.precio_costo,
        stock_contado: p.stock + compras + ajustes,
      }
    })
  )

  // 6. Bulk insert control items with pre-filled stock_contado
  if (enrichedProducts.length > 0) {
    const { error: itemsError } = await supabase
      .from('uniks_control_items')
      .insert(
        enrichedProducts.map(p => ({
          sesion_id: sesion.id,
          producto_id: p.id,
          stock_anterior: p.stock,
          costo_unitario: p.precio_costo,
          stock_contado: p.stock_contado,
        }))
      )

    if (itemsError) {
      console.error('Error creating control items:', itemsError)
      await supabase.from('uniks_control_sesiones').delete().eq('id', sesion.id)
      return { success: false, error: 'Error al registrar los ítems de control.' }
    }
  }

  // 6. Revalidate
  revalidatePath('/admin/control-stock')

  // 7. Return
  return { success: true, data: sesion as ControlSesion }
}

// ============================================================
// getControlSesiones
// ============================================================

export async function getControlSesiones(): Promise<ControlSesion[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_control_sesiones')
    .select('*')
    .order('fecha_fin', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching control sesiones:', error)
    return []
  }

  return (data as ControlSesion[]) || []
}

// ============================================================
// getControlSesionById
// ============================================================

export async function getControlSesionById(id: string): Promise<ControlSesionConItems | null> {
  const supabase = await createClient()

  // Query session
  const { data: sesion, error: sesionError } = await supabase
    .from('uniks_control_sesiones')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (sesionError || !sesion) {
    console.error('Error fetching control sesion:', sesionError)
    return null
  }

  // Query items joined with producto
  const { data: rawItems, error: itemsError } = await supabase
    .from('uniks_control_items')
    .select(`
      *,
      producto:uniks_productos(id, nombre, codigo, stock, precio_costo)
    `)
    .eq('sesion_id', id)
    .order('created_at', { ascending: true })

  if (itemsError) {
    console.error('Error fetching control items:', itemsError)
    return null
  }

  const items = rawItems || []

  // For each item, compute derived fields with parallel RPC calls
  const enrichedItems: ControlItem[] = await Promise.all(
    items.map(async (item) => {
      const [comprasRes, ajustesRes] = await Promise.all([
        supabase.rpc('get_compras_en_periodo', {
          p_producto_id: item.producto_id,
          p_inicio: sesion.fecha_inicio,
          p_fin: sesion.fecha_fin,
        }),
        supabase.rpc('get_ajustes_en_periodo', {
          p_producto_id: item.producto_id,
          p_inicio: sesion.fecha_inicio,
          p_fin: sesion.fecha_fin,
        }),
      ])

      const compras = (comprasRes.data as number) ?? 0
      const ajustes = (ajustesRes.data as number) ?? 0
      const consumo_calculado =
        item.stock_contado !== null
          ? item.stock_anterior + compras + ajustes - item.stock_contado
          : null
      const costo_total =
        consumo_calculado !== null && item.costo_unitario !== null
          ? consumo_calculado * item.costo_unitario
          : null

      return {
        ...item,
        compras_en_periodo: compras,
        ajustes_en_periodo: ajustes,
        consumo_calculado,
        costo_total,
      } as ControlItem
    })
  )

  return {
    ...(sesion as ControlSesion),
    items: enrichedItems,
  }
}

// ============================================================
// updateControlItem
// ============================================================

export async function updateControlItem(
  itemId: string,
  stockContado: number | null
): Promise<ActionResult<ControlItem>> {
  const supabase = await createClient()

  // 1. Fetch item + parent session estado
  const { data: item, error: fetchError } = await supabase
    .from('uniks_control_items')
    .select('*, sesion:uniks_control_sesiones(estado)')
    .eq('id', itemId)
    .single()

  if (fetchError || !item) {
    return { success: false, error: 'Ítem no encontrado.' }
  }

  // 2. Check session is still borrador
  const sesionEstado = (item.sesion as { estado: string } | null)?.estado
  if (sesionEstado !== 'borrador') {
    return { success: false, error: 'No se puede modificar una sesión cerrada.' }
  }

  // 3. Validate stockContado
  if (stockContado !== null) {
    if (!Number.isInteger(stockContado) || stockContado < 0) {
      return {
        success: false,
        error: 'El stock contado debe ser un número entero no negativo.',
      }
    }
  }

  // 4. UPDATE item
  const { data: updatedItem, error: updateError } = await supabase
    .from('uniks_control_items')
    .update({ stock_contado: stockContado })
    .eq('id', itemId)
    .select()
    .single()

  if (updateError || !updatedItem) {
    console.error('Error updating control item:', updateError)
    return { success: false, error: 'Error al actualizar el ítem.' }
  }

  // 5. Revalidate
  revalidatePath(`/admin/control-stock/${item.sesion_id}`)

  // 6. Return updated item (without computed fields — those come from getControlSesionById)
  return { success: true, data: updatedItem as ControlItem }
}

// ============================================================
// closeControlSesion
// ============================================================

export async function closeControlSesion(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('close_control_sesion', { p_sesion_id: id })

  if (error) {
    const msg = error.message ?? ''
    if (msg.includes('ya esta cerrada')) return { success: false, error: 'Esta sesión ya está cerrada.' }
    if (msg.includes('Faltan')) return { success: false, error: msg }
    return { success: false, error: 'Error al cerrar la sesión. Intenta de nuevo.' }
  }

  revalidatePath('/admin/control-stock')
  revalidatePath(`/admin/control-stock/${id}`)
  revalidatePath(`/admin/control-stock/${id}/reporte`)
  revalidatePath('/admin/productos')
  revalidatePath('/admin')

  return { success: true }
}

// ============================================================
// deleteControlSesion
// ============================================================

export async function deleteControlSesion(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  // 1. Fetch session estado
  const { data: sesion, error: fetchError } = await supabase
    .from('uniks_control_sesiones')
    .select('estado')
    .eq('id', id)
    .single()

  if (fetchError || !sesion) {
    return { success: false, error: 'Sesión no encontrada.' }
  }

  // 2. Only borrador sessions can be deleted
  if (sesion.estado !== 'borrador') {
    return { success: false, error: 'No se puede eliminar una sesión cerrada.' }
  }

  // 3. DELETE (CASCADE handles items)
  const { error } = await supabase
    .from('uniks_control_sesiones')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting control sesion:', error)
    return { success: false, error: 'Error al eliminar la sesión.' }
  }

  // 4. Revalidate
  revalidatePath('/admin/control-stock')

  return { success: true }
}

// ============================================================
// getControlResumen
// ============================================================

export async function getControlResumen(id: string): Promise<ControlResumen | null> {
  // 1. Fetch full session with items
  const sesionConItems = await getControlSesionById(id)

  if (!sesionConItems) return null
  if (sesionConItems.estado !== 'cerrada') return null

  const { items, ...sesion } = sesionConItems

  // 2. Build date range in Lima timezone
  const { startDate, endDate } = limaRange(sesion.fecha_inicio, sesion.fecha_fin)

  // 3. Get payment summary for revenue
  const summary = await getPaymentSummary(startDate, endDate)

  // 4. Aggregate
  const total_costo = items.reduce((sum, i) => sum + (i.costo_total ?? 0), 0)
  const total_unidades_consumidas = items.reduce(
    (sum, i) => sum + (i.consumo_calculado ?? 0),
    0
  )
  const productos_sin_costo = items.filter(
    i => i.costo_unitario === null && (i.consumo_calculado ?? 0) > 0
  ).length
  const ingresos = summary.total
  const margen_bruto = ingresos - total_costo
  const margen_pct =
    ingresos > 0 ? Math.round((margen_bruto / ingresos) * 100) / 100 : null

  return {
    sesion,
    items,
    total_unidades_consumidas,
    total_costo,
    productos_sin_costo,
    ingresos,
    margen_bruto,
    margen_pct,
  }
}
