'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import type { Gasto, GastoCategoria, GastoMetodoPago, GastoTipoComprobante, ActionResult } from '@/types/admin'

const CATEGORIAS_VALIDAS: GastoCategoria[] = ['insumos', 'servicios', 'alquiler', 'marketing', 'otros']
const METODOS_PAGO_VALIDOS: GastoMetodoPago[] = ['efectivo', 'transferencia', 'yape']
const TIPOS_COMPROBANTE_VALIDOS: GastoTipoComprobante[] = ['factura', 'boleta', 'ticket', 'sin_comprobante']

function validarCategoria(categoria: string): categoria is GastoCategoria {
  return CATEGORIAS_VALIDAS.includes(categoria as GastoCategoria)
}

function validarMetodoPago(metodo: string): metodo is GastoMetodoPago {
  return METODOS_PAGO_VALIDOS.includes(metodo as GastoMetodoPago)
}

function validarTipoComprobante(tipo: string): tipo is GastoTipoComprobante {
  return TIPOS_COMPROBANTE_VALIDOS.includes(tipo as GastoTipoComprobante)
}

export async function getExpenses(
  filters?: { categoria?: string; startDate?: string; endDate?: string; proveedorSearch?: string }
): Promise<Gasto[]> {
  const supabase = await createSupabaseClient()

  let query = supabase
    .from('uniks_gastos')
    .select('*, proveedor:uniks_proveedores(*)')
    .order('fecha', { ascending: false })

  if (filters?.categoria && validarCategoria(filters.categoria)) {
    query = query.eq('categoria', filters.categoria)
  }

  if (filters?.startDate) {
    query = query.gte('fecha', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('fecha', filters.endDate)
  }

  if (filters?.proveedorSearch && filters.proveedorSearch.trim()) {
    const term = filters.proveedorSearch.trim()
    query = query.or(`proveedor_nombre.ilike.%${term}%,proveedor.nombre.ilike.%${term}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching expenses:', error)
    return []
  }

  return data || []
}

export async function getExpenseById(id: string): Promise<Gasto | null> {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('uniks_gastos')
    .select('*, proveedor:uniks_proveedores(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching expense:', error)
    return null
  }

  return data
}

export async function createExpense(formData: FormData): Promise<ActionResult<Gasto>> {
  const supabase = await createSupabaseClient()

  const montoStr = formData.get('monto') as string
  const monto = parseFloat(montoStr)
  const categoria = formData.get('categoria') as string
  const fecha = formData.get('fecha') as string
  const descripcion = (formData.get('descripcion') as string)?.trim() || null
  const metodo_pago = formData.get('metodo_pago') as string
  const proveedor_id = (formData.get('proveedor_id') as string) || null
  const proveedor_nombre = (formData.get('proveedor_nombre') as string)?.trim() || null
  const tipo_comprobante = formData.get('tipo_comprobante') as string
  const numero_comprobante = (formData.get('numero_comprobante') as string)?.trim() || null
  const numero_operacion = (formData.get('numero_operacion') as string)?.trim() || null

  if (!montoStr || isNaN(monto) || monto <= 0) {
    return { success: false, error: 'El monto debe ser un número mayor a 0' }
  }

  if (!categoria) {
    return { success: false, error: 'La categoría es obligatoria' }
  }

  if (!validarCategoria(categoria)) {
    return { success: false, error: 'Categoría no válida' }
  }

  if (!fecha) {
    return { success: false, error: 'La fecha es obligatoria' }
  }

  if (!metodo_pago) {
    return { success: false, error: 'El método de pago es obligatorio' }
  }

  if (!validarMetodoPago(metodo_pago)) {
    return { success: false, error: 'Método de pago no válido' }
  }

  if (!tipo_comprobante) {
    return { success: false, error: 'El tipo de comprobante es obligatorio' }
  }

  if (!validarTipoComprobante(tipo_comprobante)) {
    return { success: false, error: 'Tipo de comprobante no válido' }
  }

  if (tipo_comprobante !== 'sin_comprobante' && !numero_comprobante) {
    console.warn('Advertencia: numero_comprobante está vacío para tipo_comprobante', tipo_comprobante)
  }

  const { data, error } = await supabase
    .from('uniks_gastos')
    .insert({
      monto,
      categoria: categoria as GastoCategoria,
      fecha,
      descripcion,
      metodo_pago: metodo_pago as GastoMetodoPago,
      proveedor_id: proveedor_id || null,
      proveedor_nombre: proveedor_nombre || null,
      tipo_comprobante: tipo_comprobante as GastoTipoComprobante,
      numero_comprobante: numero_comprobante || null,
      numero_operacion: numero_operacion || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating expense:', error)
    return { success: false, error: 'Error al registrar el gasto' }
  }

  revalidatePath('/admin/gastos')
  revalidatePath('/admin')
  return { success: true, data }
}

export async function updateExpense(
  id: string,
  formData: FormData
): Promise<ActionResult<Gasto>> {
  const supabase = await createSupabaseClient()

  const montoStr = formData.get('monto') as string
  const monto = parseFloat(montoStr)
  const categoria = formData.get('categoria') as string
  const fecha = formData.get('fecha') as string
  const descripcion = (formData.get('descripcion') as string)?.trim() || null
  const metodo_pago = formData.get('metodo_pago') as string
  const proveedor_id = (formData.get('proveedor_id') as string) || null
  const proveedor_nombre = (formData.get('proveedor_nombre') as string)?.trim() || null
  const tipo_comprobante = formData.get('tipo_comprobante') as string
  const numero_comprobante = (formData.get('numero_comprobante') as string)?.trim() || null
  const numero_operacion = (formData.get('numero_operacion') as string)?.trim() || null

  if (!montoStr || isNaN(monto) || monto <= 0) {
    return { success: false, error: 'El monto debe ser un número mayor a 0' }
  }

  if (!categoria) {
    return { success: false, error: 'La categoría es obligatoria' }
  }

  if (!validarCategoria(categoria)) {
    return { success: false, error: 'Categoría no válida' }
  }

  if (!fecha) {
    return { success: false, error: 'La fecha es obligatoria' }
  }

  if (!metodo_pago) {
    return { success: false, error: 'El método de pago es obligatorio' }
  }

  if (!validarMetodoPago(metodo_pago)) {
    return { success: false, error: 'Método de pago no válido' }
  }

  if (!tipo_comprobante) {
    return { success: false, error: 'El tipo de comprobante es obligatorio' }
  }

  if (!validarTipoComprobante(tipo_comprobante)) {
    return { success: false, error: 'Tipo de comprobante no válido' }
  }

  if (tipo_comprobante !== 'sin_comprobante' && !numero_comprobante) {
    console.warn('Advertencia: numero_comprobante está vacío para tipo_comprobante', tipo_comprobante)
  }

  const { data, error } = await supabase
    .from('uniks_gastos')
    .update({
      monto,
      categoria: categoria as GastoCategoria,
      fecha,
      descripcion,
      metodo_pago: metodo_pago as GastoMetodoPago,
      proveedor_id: proveedor_id || null,
      proveedor_nombre: proveedor_nombre || null,
      tipo_comprobante: tipo_comprobante as GastoTipoComprobante,
      numero_comprobante: numero_comprobante || null,
      numero_operacion: numero_operacion || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating expense:', error)
    return { success: false, error: 'Error al actualizar el gasto' }
  }

  revalidatePath('/admin/gastos')
  revalidatePath('/admin')
  return { success: true, data }
}

export async function deleteExpense(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseClient()

  const { error } = await supabase
    .from('uniks_gastos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting expense:', error)
    return { success: false, error: 'Error al eliminar el gasto' }
  }

  revalidatePath('/admin/gastos')
  revalidatePath('/admin')
  return { success: true }
}
