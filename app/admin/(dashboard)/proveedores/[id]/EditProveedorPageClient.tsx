'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProveedor, deleteProveedor } from '@/lib/actions/proveedores'
import ProveedorForm from '../components/ProveedorForm'
import type { Proveedor } from '@/types/admin'

interface Props {
  proveedor: Proveedor
}

export default function EditProveedorPageClient({ proveedor }: Props) {
  const router = useRouter()
  const [deleteError, setDeleteError] = useState('')

  async function handleSubmit(formData: FormData) {
    return updateProveedor(proveedor.id, formData)
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este proveedor? Esta acción no se puede deshacer.')) {
      return
    }
    const result = await deleteProveedor(proveedor.id)
    if (result.success) {
      router.push('/admin/proveedores')
      router.refresh()
    } else {
      setDeleteError(result.error || 'Error al eliminar el proveedor')
    }
  }

  return (
    <div>
      {deleteError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {deleteError}
        </div>
      )}
      <ProveedorForm
        proveedor={proveedor}
        onSubmit={handleSubmit}
        backHref="/admin/proveedores"
        title="Editar Proveedor"
        subtitle="Modifica los datos del proveedor"
        submitLabel="Actualizar Proveedor"
        headerActions={
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Eliminar Proveedor
          </button>
        }
      />
    </div>
  )
}
