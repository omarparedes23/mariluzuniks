import Link from 'next/link'
import { getServices } from '@/lib/actions/services'
import { Plus, Pencil, Scissors, Clock } from 'lucide-react'
import { DeleteServiceButton } from './components/DeleteServiceButton'

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Servicios</h1>
          <p className="text-muted">Gestiona los servicios del salón</p>
        </div>
        <Link
          href="/admin/servicios/nuevo"
          className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Servicio
        </Link>
      </div>

      {services.length > 0 ? (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left p-4 text-cream font-medium">Nombre</th>
                <th className="text-left p-4 text-cream font-medium">Duración</th>
                <th className="text-left p-4 text-cream font-medium">Precio</th>
                <th className="text-right p-4 text-cream font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gold/10 last:border-b-0">
                  <td className="p-4 text-cream">{service.nombre}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-cream">
                      <Clock className="w-4 h-4 text-muted" />
                      {service.duracion} min
                    </span>
                  </td>
                  <td className="p-4 text-cream">S/ {Number(service.precio).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/servicios/${service.id}`}
                        className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteServiceButton serviceId={service.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg p-12 text-center">
          <Scissors className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-cream mb-2">No hay servicios registrados</p>
          <p className="text-muted text-sm mb-4">Comienza agregando tu primer servicio</p>
          <Link
            href="/admin/servicios/nuevo"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Agregar servicio →
          </Link>
        </div>
      )}
    </div>
  )
}
