'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Servicio, ActionResult } from '@/types/admin'

export async function getServices(): Promise<Servicio[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('uniks_servicios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

export async function getService(id: string): Promise<Servicio | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('uniks_servicios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching service:', error)
    return null
  }

  return data
}

export async function createService(formData: FormData): Promise<ActionResult<Servicio>> {
  const supabase = await createClient()
  
  const nombre = formData.get('nombre') as string
  const precio = parseFloat(formData.get('precio') as string)
  const duracion = parseInt(formData.get('duracion') as string)

  if (duracion <= 0) {
    return { success: false, error: 'Duración debe ser positiva' }
  }

  const { data, error } = await supabase
    .from('uniks_servicios')
    .insert({
      nombre,
      precio,
      duracion,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: 'Error al crear el servicio' }
  }

  revalidatePath('/admin/servicios')
  return { success: true, data }
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult<Servicio>> {
  const supabase = await createClient()
  
  const nombre = formData.get('nombre') as string
  const precio = parseFloat(formData.get('precio') as string)
  const duracion = parseInt(formData.get('duracion') as string)

  if (duracion <= 0) {
    return { success: false, error: 'Duración debe ser positiva' }
  }

  const { data, error } = await supabase
    .from('uniks_servicios')
    .update({
      nombre,
      precio,
      duracion,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { success: false, error: 'Error al actualizar el servicio' }
  }

  revalidatePath('/admin/servicios')
  return { success: true, data }
}

export async function deleteService(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('uniks_servicios')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: 'Error al eliminar el servicio. Puede tener pagos asociados.' }
  }

  revalidatePath('/admin/servicios')
  return { success: true }
}
