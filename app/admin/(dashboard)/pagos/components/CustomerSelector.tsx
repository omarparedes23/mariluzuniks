'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getClients, createClient } from '@/lib/actions/clients'
import type { Cliente } from '@/types/admin'
import { Search, User, Phone, Plus, X, Check, ChevronDown } from 'lucide-react'

interface CustomerSelectorProps {
  value: string | null
  onChange: (customerId: string | null, customerName: string | null) => void
  placeholder?: string
}

export default function CustomerSelector({
  value,
  onChange,
  placeholder = 'Seleccionar cliente...',
}: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCustomer = customers.find((c) => c.id === value)

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    const data = await getClients()
    setCustomers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowCreateForm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(term) ||
      (c.telefono?.toLowerCase() || '').includes(term) ||
      (c.email?.toLowerCase() || '').includes(term)
    )
  })

  function handleSelect(customer: Cliente) {
    onChange(customer.id, customer.nombre)
    setIsOpen(false)
    setSearch('')
  }

  function handleClear() {
    onChange(null, null)
    setSearch('')
  }

  async function handleCreateCustomer(formData: FormData) {
    setCreateLoading(true)
    setCreateError('')

    const result = await createClient(formData)

    if (result.success && result.data) {
      setCustomers((prev) => [result.data as Cliente, ...prev])
      onChange((result.data as Cliente).id, (result.data as Cliente).nombre)
      setShowCreateForm(false)
      setIsOpen(false)
      setSearch('')
    } else {
      setCreateError(result.error || 'Error al crear el cliente')
    }

    setCreateLoading(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-bg border border-gold/30 rounded px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <User className="w-4 h-4 text-muted shrink-0" />
          {selectedCustomer ? (
            <span className="truncate">
              {selectedCustomer.nombre}
              {selectedCustomer.telefono && (
                <span className="text-muted text-sm ml-2">({selectedCustomer.telefono})</span>
              )}
            </span>
          ) : (
            <span className="text-muted">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectedCustomer && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="p-1 text-muted hover:text-cream transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-gold/20 rounded-lg shadow-xl overflow-hidden">
          {!showCreateForm ? (
            <>
              {/* Search input inside dropdown */}
              <div className="p-3 border-b border-gold/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar cliente..."
                    autoFocus
                    className="w-full bg-bg border border-gold/20 rounded pl-9 pr-3 py-2 text-cream text-sm placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Customer list */}
              <div className="max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-muted text-sm">Cargando...</div>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => handleSelect(customer)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gold/5 transition-colors ${
                        customer.id === value ? 'bg-gold/10' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-cream text-sm">
                          {customer.id === value && <Check className="w-4 h-4 text-gold shrink-0" />}
                          <span className="truncate font-medium">{customer.nombre}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-muted text-xs">
                          {customer.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.telefono}
                            </span>
                          )}
                          {customer.email && (
                            <span className="truncate">{customer.email}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted text-sm">
                    {search ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                  </div>
                )}
              </div>

              {/* Add new option */}
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true)
                  setCreateError('')
                }}
                className="w-full flex items-center gap-2 px-4 py-3 border-t border-gold/20 text-gold hover:bg-gold/5 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Nuevo Cliente
              </button>
            </>
          ) : (
            /* Inline create form */
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-cream">Nuevo Cliente</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setCreateError('')
                  }}
                  className="p-1 text-muted hover:text-cream transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {createError && (
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                  {createError}
                </div>
              )}

              <form
                action={handleCreateCustomer}
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  handleCreateCustomer(new FormData(form))
                }}
              >
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Nombre *"
                  autoFocus
                  className="w-full bg-bg border border-gold/20 rounded px-3 py-2 text-cream text-sm placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  className="w-full bg-bg border border-gold/20 rounded px-3 py-2 text-cream text-sm placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full bg-bg border border-gold/20 rounded px-3 py-2 text-cream text-sm placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-gold text-black px-3 py-2 rounded text-sm font-medium hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? 'Guardando...' : 'Guardar y seleccionar'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
