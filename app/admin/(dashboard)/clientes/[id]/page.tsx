'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getClientById, updateClient, deleteClient } from '@/lib/actions/clients'
import CustomerForm from '../components/CustomerForm'
import type { Cliente } from '@/types/admin'

export default function EditCustomerPage() {
  const params = useParams()
  const id = params.id as string
  const [customer, setCustomer] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    async function loadCustomer() {
      const data = await getClientById(id)
      setCustomer(data)
      setLoading(false)
    }
    loadCustomer()
  }, [id])

  async function handleSubmit(formData: FormData) {
    return updateClient(id, formData)
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      return
    }
    const result = await deleteClient(id)
    if (result.success) {
      window.location.href = '/admin/clientes'
    } else {
      setDeleteError(result.error || 'Error al eliminar el cliente')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted">Cargando...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Cliente no encontrado</p>
        <a href="/admin/clientes" className="text-gold hover:text-gold-light mt-4 inline-block">
          Volver a clientes
        </a>
      </div>
    )
  }

  return (
    <div>
      {deleteError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {deleteError}
        </div>
      )}
      <CustomerForm
        customer={customer}
        onSubmit={handleSubmit}
        backHref="/admin/clientes"
        title="Editar Cliente"
        subtitle="Modifica los datos del cliente"
        submitLabel="Actualizar Cliente"
        headerActions={
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Eliminar Cliente
          </button>
        }
      />
    </div>
  )
}
