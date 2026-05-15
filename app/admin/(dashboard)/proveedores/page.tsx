import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProveedorList from './components/ProveedorList'

export default function ProveedoresPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Proveedores</h1>
          <p className="text-muted">Gestiona los proveedores del salón</p>
        </div>
        <Link
          href="/admin/proveedores/nuevo"
          className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </Link>
      </div>

      <ProveedorList />
    </div>
  )
}
