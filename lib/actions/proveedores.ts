'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import type { Proveedor, ActionResult } from '@/types/admin'

export async function getProveedores(search?: string): Promise<Proveedor[]> {
  const supabase = await createSupabaseClient()

  let query = supabase
    .from('uniks_proveedores')
    .select('*')
    .order('created_at', { ascending: false })

  if (search && search.trim()) {
    const term = search.trim()
    query = query.ilike('nombre', `%${term}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching proveedores:', error)
    return []
  }

  return data || []
}

export async function getProveedorById(id: string): Promise<Proveedor | null> {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('uniks_proveedores')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching proveedor:', error)
    return null
  }

  return data
}

export async function createProveedor(formData: FormData): Promise<ActionResult<Proveedor>> {
  const supabase = await createSupabaseClient()

  const nombre = (formData.get('nombre') as string)?.trim()
  const telefono = (formData.get('telefono') as string)?.trim() || null
  const ruc = (formData.get('ruc') as string)?.trim() || null
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!nombre) {
    return { success: false, error: 'El nombre es obligatorio' }
  }

  const { data, error } = await supabase
    .from('uniks_proveedores')
    .insert({
      nombre,
      telefono,
      ruc,
      notas,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating proveedor:', error)
    return { success: false, error: 'Error al crear el proveedor' }
  }

  revalidatePath('/admin/proveedores')
  return { success: true, data }
}

export async function updateProveedor(
  id: string,
  formData: FormData
): Promise<ActionResult<Proveedor>> {
  const supabase = await createSupabaseClient()

  const nombre = (formData.get('nombre') as string)?.trim()
  const telefono = (formData.get('telefono') as string)?.trim() || null
  const ruc = (formData.get('ruc') as string)?.trim() || null
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!nombre) {
    return { success: false, error: 'El nombre es obligatorio' }
  }

  const { data, error } = await supabase
    .from('uniks_proveedores')
    .update({
      nombre,
      telefono,
      ruc,
      notas,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating proveedor:', error)
    return { success: false, error: 'Error al actualizar el proveedor' }
  }

  revalidatePath('/admin/proveedores')
  return { success: true, data }
}

export async function deleteProveedor(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseClient()

  // Check if proveedor has linked gastos
  const { count, error: countError } = await supabase
    .from('uniks_gastos')
    .select('*', { count: 'exact', head: true })
    .eq('proveedor_id', id)

  if (countError) {
    console.error('Error checking proveedor gastos:', countError)
    return { success: false, error: 'Error al verificar gastos del proveedor' }
  }

  if (count && count > 0) {
    return {
      success: false,
      error: 'No se puede eliminar el proveedor porque tiene gastos registrados',
    }
  }

  const { error } = await supabase
    .from('uniks_proveedores')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting proveedor:', error)
    return { success: false, error: 'Error al eliminar el proveedor' }
  }

  revalidatePath('/admin/proveedores')
  return { success: true }
}
