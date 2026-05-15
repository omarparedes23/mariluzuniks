'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Pago, Servicio, ActionResult, PaymentSummary, PagoServicio } from '@/types/admin'

export async function getPayments(startDate?: string, endDate?: string): Promise<Pago[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('uniks_pagos')
    .select(`
      *,
      cliente:uniks_clientes(id, nombre, telefono, email, notas, created_at, updated_at),
      servicios:uniks_pago_servicios(
        id,
        servicio_id,
        precio_aplicado,
        servicio:uniks_servicios(id, nombre, precio, duracion)
      )
    `)
    .order('fecha', { ascending: false })

  if (startDate) {
    query = query.gte('fecha', startDate)
  }
  
  if (endDate) {
    query = query.lte('fecha', endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching payments:', error)
    return []
  }

  return data || []
}

export async function getPaymentSummary(startDate?: string, endDate?: string): Promise<PaymentSummary> {
  const supabase = await createClient()
  
  let query = supabase
    .from('uniks_pagos')
    .select('monto_total, metodo_pago')

  if (startDate) {
    query = query.gte('fecha', startDate)
  }
  
  if (endDate) {
    query = query.lte('fecha', endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching payment summary:', error)
    return { total: 0, efectivo: 0, transferencia: 0, yape: 0, count: 0 }
  }

  const payments = data || []
  const total = payments.reduce((sum, p) => sum + Number(p.monto_total), 0)
  const efectivo = payments
    .filter(p => p.metodo_pago === 'efectivo')
    .reduce((sum, p) => sum + Number(p.monto_total), 0)
  const transferencia = payments
    .filter(p => p.metodo_pago === 'transferencia')
    .reduce((sum, p) => sum + Number(p.monto_total), 0)
  const yape = payments
    .filter(p => p.metodo_pago === 'yape')
    .reduce((sum, p) => sum + Number(p.monto_total), 0)

  return {
    total,
    efectivo,
    transferencia,
    yape,
    count: payments.length,
  }
}

export async function createPayment(formData: FormData): Promise<ActionResult<Pago>> {
  const supabase = await createClient()

  const monto_total = parseFloat(formData.get('monto_total') as string)
  const metodo_pago = formData.get('metodo_pago') as 'efectivo' | 'transferencia' | 'yape'
  const cliente_id = formData.get('cliente_id') as string | null
  const cliente_nombre = formData.get('cliente_nombre') as string
  const descripcion = formData.get('descripcion') as string
  const fecha = formData.get('fecha') as string
  const numero_operacion = (formData.get('numero_operacion') as string)?.trim() || null

  // Obtener servicios del formulario
  const serviciosJson = formData.get('servicios') as string
  const servicios = JSON.parse(serviciosJson || '[]') as { servicio_id: string; precio_aplicado: number }[]

  // Validar que el monto coincida con la suma de servicios (opcional, pero recomendado)
  const sumaServicios = servicios.reduce((sum, s) => sum + s.precio_aplicado, 0)
  if (servicios.length > 0 && Math.abs(sumaServicios - monto_total) > 0.01) {
    console.warn('Monto total no coincide con suma de servicios:', { monto_total, sumaServicios })
  }

  // Validación: número de operación recomendado para transferencia/yape
  if ((metodo_pago === 'transferencia' || metodo_pago === 'yape') && !numero_operacion) {
    console.warn('Advertencia: numero_operacion está vacío para metodo_pago', metodo_pago)
  }

  // Crear el pago
  const { data: pago, error: pagoError } = await supabase
    .from('uniks_pagos')
    .insert({
      monto_total,
      metodo_pago,
      cliente_id: cliente_id || null,
      cliente_nombre: cliente_nombre || null,
      descripcion: descripcion || null,
      fecha: fecha || new Date().toISOString(),
      numero_operacion: numero_operacion || null,
    })
    .select()
    .single()

  if (pagoError || !pago) {
    console.error('Error creating payment:', pagoError)
    return { success: false, error: 'Error al registrar el pago' }
  }

  // Insertar los servicios del pago
  if (servicios.length > 0) {
    const serviciosData = servicios.map(s => ({
      pago_id: pago.id,
      servicio_id: s.servicio_id,
      precio_aplicado: s.precio_aplicado,
    }))

    const { error: serviciosError } = await supabase
      .from('uniks_pago_servicios')
      .insert(serviciosData)

    if (serviciosError) {
      console.error('Error creating payment services:', serviciosError)
      // No fallamos el pago completo, solo logueamos el error
    }
  }

  revalidatePath('/admin/pagos')
  revalidatePath('/admin')
  return { success: true, data: pago }
}

export async function deletePayment(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  // Los servicios se eliminarán en cascada por ON DELETE CASCADE
  const { error } = await supabase
    .from('uniks_pagos')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: 'Error al eliminar el pago' }
  }

  revalidatePath('/admin/pagos')
  revalidatePath('/admin')
  return { success: true }
}

export async function getPaymentWithServices(id: string): Promise<Pago | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('uniks_pagos')
    .select(`
      *,
      cliente:uniks_clientes(id, nombre, telefono, email, notas, created_at, updated_at),
      servicios:uniks_pago_servicios(
        id,
        servicio_id,
        precio_aplicado,
        servicio:uniks_servicios(id, nombre, precio, duracion)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching payment:', error)
    return null
  }

  return data
}

export async function getPaymentById(id: string): Promise<Pago | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uniks_pagos')
    .select(`
      *,
      cliente:uniks_clientes(id, nombre, telefono, email, notas, created_at, updated_at),
      servicios:uniks_pago_servicios(
        id,
        servicio_id,
        precio_aplicado,
        servicio:uniks_servicios(id, nombre, precio, duracion)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching payment:', error)
    return null
  }

  return data
}

export async function updatePayment(
  id: string,
  formData: FormData
): Promise<ActionResult<Pago>> {
  const supabase = await createClient()

  const monto_total = parseFloat(formData.get('monto_total') as string)
  const metodo_pago = formData.get('metodo_pago') as 'efectivo' | 'transferencia' | 'yape'
  const cliente_id = formData.get('cliente_id') as string | null
  const cliente_nombre = formData.get('cliente_nombre') as string
  const descripcion = formData.get('descripcion') as string
  const fecha = formData.get('fecha') as string
  const numero_operacion = (formData.get('numero_operacion') as string)?.trim() || null

  // Obtener servicios del formulario
  const serviciosJson = formData.get('servicios') as string
  const servicios = JSON.parse(serviciosJson || '[]') as { servicio_id: string; precio_aplicado: number }[]

  // Validación: número de operación recomendado para transferencia/yape
  if ((metodo_pago === 'transferencia' || metodo_pago === 'yape') && !numero_operacion) {
    console.warn('Advertencia: numero_operacion está vacío para metodo_pago', metodo_pago)
  }

  const { data, error } = await supabase
    .from('uniks_pagos')
    .update({
      monto_total,
      metodo_pago,
      cliente_id: cliente_id || null,
      cliente_nombre: cliente_nombre || null,
      descripcion: descripcion || null,
      fecha: fecha || new Date().toISOString(),
      numero_operacion: numero_operacion || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating payment:', error)
    return { success: false, error: 'Error al actualizar el pago' }
  }

  // Actualizar servicios: eliminar existentes e insertar nuevos
  if (servicios.length > 0) {
    // Eliminar servicios existentes
    await supabase
      .from('uniks_pago_servicios')
      .delete()
      .eq('pago_id', id)

    const serviciosData = servicios.map(s => ({
      pago_id: id,
      servicio_id: s.servicio_id,
      precio_aplicado: s.precio_aplicado,
    }))

    const { error: serviciosError } = await supabase
      .from('uniks_pago_servicios')
      .insert(serviciosData)

    if (serviciosError) {
      console.error('Error updating payment services:', serviciosError)
    }
  }

  revalidatePath('/admin/pagos')
  revalidatePath('/admin')
  return { success: true, data }
}

export async function getServicesForSelect(): Promise<Servicio[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('uniks_servicios')
    .select('id, nombre, precio, duracion')
    .order('nombre', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}
