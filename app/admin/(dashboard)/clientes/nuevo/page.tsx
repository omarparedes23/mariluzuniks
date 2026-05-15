'use client'

import { createClient } from '@/lib/actions/clients'
import CustomerForm from '../components/CustomerForm'

export default function NewCustomerPage() {
  async function handleSubmit(formData: FormData) {
    return createClient(formData)
  }

  return (
    <CustomerForm
      onSubmit={handleSubmit}
      backHref="/admin/clientes"
      title="Nuevo Cliente"
      subtitle="Agrega un cliente a la base de datos"
      submitLabel="Guardar Cliente"
    />
  )
}
