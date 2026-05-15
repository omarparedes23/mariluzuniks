import Link from 'next/link'
import { Plus } from 'lucide-react'
import CustomerList from './components/CustomerList'

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Clientes</h1>
          <p className="text-muted">Gestiona los clientes del salón</p>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Link>
      </div>

      <CustomerList />
    </div>
  )
}
