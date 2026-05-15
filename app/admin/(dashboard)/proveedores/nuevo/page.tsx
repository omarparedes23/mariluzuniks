import { createProveedor } from '@/lib/actions/proveedores'
import ProveedorForm from '../components/ProveedorForm'

export default function NewProveedorPage() {
  return (
    <ProveedorForm
      onSubmit={createProveedor}
      backHref="/admin/proveedores"
      title="Nuevo Proveedor"
      subtitle="Registra un nuevo proveedor"
      submitLabel="Guardar Proveedor"
    />
  )
}
