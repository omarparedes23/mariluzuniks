'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getClients } from '@/lib/actions/clients'
import type { Cliente } from '@/types/admin'
import { Search, User, Phone, Mail, Calendar, Pencil, Users } from 'lucide-react'
import { DeleteCustomerButton } from './DeleteCustomerButton'

export default function CustomerList() {
  const [customers, setCustomers] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    const data = await getClients(search)
    setCustomers(data)
    setLoading(false)
  }, [search])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre, teléfono o email..."
          className="w-full bg-card border border-gold/20 rounded-lg pl-10 pr-4 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted">Cargando clientes...</div>
        </div>
      ) : customers.length > 0 ? (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left p-4 text-cream font-medium">Nombre</th>
                <th className="text-left p-4 text-cream font-medium">Teléfono</th>
                <th className="text-left p-4 text-cream font-medium">Email</th>
                <th className="text-left p-4 text-cream font-medium">Registro</th>
                <th className="text-right p-4 text-cream font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gold/10 last:border-b-0 hover:bg-gold/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-cream">
                      <User className="w-4 h-4 text-muted shrink-0" />
                      {customer.nombre}
                    </div>
                  </td>
                  <td className="p-4">
                    {customer.telefono ? (
                      <span className="flex items-center gap-1 text-cream">
                        <Phone className="w-4 h-4 text-muted" />
                        {customer.telefono}
                      </span>
                    ) : (
                      <span className="text-muted text-sm">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {customer.email ? (
                      <span className="flex items-center gap-1 text-cream">
                        <Mail className="w-4 h-4 text-muted" />
                        {customer.email}
                      </span>
                    ) : (
                      <span className="text-muted text-sm">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-muted text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(customer.created_at)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/clientes/${customer.id}`}
                        className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteCustomerButton customerId={customer.id} onDeleted={loadCustomers} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-cream mb-2">
            {search ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </p>
          <p className="text-muted text-sm mb-4">
            {search
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza agregando tu primer cliente'}
          </p>
          {!search && (
            <Link
              href="/admin/clientes/nuevo"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Agregar cliente →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
