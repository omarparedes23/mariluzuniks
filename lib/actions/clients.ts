'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import type { Cliente, ActionResult } from '@/types/admin'

export async function getClients(search?: string): Promise<Cliente[]> {
  const supabase = await createSupabaseClient()

  let query = supabase
    .from('uniks_clientes')
    .select('*')
    .order('created_at', { ascending: false })

  if (search && search.trim()) {
    const term = search.trim()
    query = query.or(`nombre.ilike.%${term}%,telefono.ilike.%${term}%,email.ilike.%${term}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  return data || []
}

export async function getClientById(id: string): Promise<Cliente | null> {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('uniks_clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching client:', error)
    return null
  }

  return data
}

export async function createClient(formData: FormData): Promise<ActionResult<Cliente>> {
  const supabase = await createSupabaseClient()

  const nombre = (formData.get('nombre') as string)?.trim()
  const telefono = (formData.get('telefono') as string)?.trim() || null
  const email = (formData.get('email') as string)?.trim() || null
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!nombre) {
    return { success: false, error: 'El nombre es obligatorio' }
  }

  const { data, error } = await supabase
    .from('uniks_clientes')
    .insert({
      nombre,
      telefono,
      email,
      notas,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating client:', error)
    return { success: false, error: 'Error al crear el cliente' }
  }

  revalidatePath('/admin/clientes')
  return { success: true, data }
}

export async function updateClient(id: string, formData: FormData): Promise<ActionResult<Cliente>> {
  const supabase = await createSupabaseClient()

  const nombre = (formData.get('nombre') as string)?.trim()
  const telefono = (formData.get('telefono') as string)?.trim() || null
  const email = (formData.get('email') as string)?.trim() || null
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!nombre) {
    return { success: false, error: 'El nombre es obligatorio' }
  }

  const { data, error } = await supabase
    .from('uniks_clientes')
    .update({
      nombre,
      telefono,
      email,
      notas,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating client:', error)
    return { success: false, error: 'Error al actualizar el cliente' }
  }

  revalidatePath('/admin/clientes')
  return { success: true, data }
}

export async function deleteClient(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseClient()

  // Check if client has linked payments
  const { count, error: countError } = await supabase
    .from('uniks_pagos')
    .select('*', { count: 'exact', head: true })
    .eq('cliente_id', id)

  if (countError) {
    console.error('Error checking client payments:', countError)
    return { success: false, error: 'Error al verificar pagos del cliente' }
  }

  if (count && count > 0) {
    return { success: false, error: 'No se puede eliminar el cliente porque tiene pagos registrados' }
  }

  const { error } = await supabase
    .from('uniks_clientes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting client:', error)
    return { success: false, error: 'Error al eliminar el cliente' }
  }

  revalidatePath('/admin/clientes')
  return { success: true }
}
