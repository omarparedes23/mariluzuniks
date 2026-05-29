import Link from 'next/link'
import { getControlSesiones } from '@/lib/actions/control-stock'
import { Plus, ClipboardList, Eye, FileText } from 'lucide-react'

function formatFecha(dateStr: string): string {
  // dateStr is YYYY-MM-DD — convert to DD/MM/YYYY
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export default async function ControlStockPage() {
  const sesiones = await getControlSesiones()

  const borrador = sesiones.find(s => s.estado === 'borrador')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Control de Stock</h1>
          <p className="text-muted">Sesiones de conteo y cierre de inventario</p>
        </div>
        <div className="flex items-center gap-3">
          {borrador ? (
            <>
              <span
                className="bg-gold/20 text-gold/60 px-4 py-2 rounded font-medium flex items-center gap-2 cursor-not-allowed"
                title="Ya hay un control abierto"
              >
                <Plus className="w-4 h-4" />
                Nueva Sesión
              </span>
              <Link
                href={`/admin/control-stock/${borrador.id}`}
                className="text-gold hover:text-gold-light transition-colors text-sm"
              >
                Ver borrador →
              </Link>
            </>
          ) : (
            <Link
              href="/admin/control-stock/nuevo"
              className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Sesión
            </Link>
          )}
        </div>
      </div>

      {sesiones.length > 0 ? (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left p-4 text-cream font-medium">Período</th>
                <th className="text-left p-4 text-cream font-medium">Estado</th>
                <th className="text-left p-4 text-cream font-medium">Notas</th>
                <th className="text-right p-4 text-cream font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sesiones.map((sesion) => (
                <tr key={sesion.id} className="border-b border-gold/10 last:border-b-0">
                  <td className="p-4 text-cream">
                    {formatFecha(sesion.fecha_inicio)}
                    <span className="text-muted mx-2">→</span>
                    {formatFecha(sesion.fecha_fin)}
                  </td>
                  <td className="p-4">
                    {sesion.estado === 'borrador' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/20 text-gold">
                        Borrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        Cerrada
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-muted text-sm">
                    {sesion.notas || '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/control-stock/${sesion.id}`}
                        className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {sesion.estado === 'cerrada' && (
                        <Link
                          href={`/admin/control-stock/${sesion.id}/reporte`}
                          className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                          title="Ver reporte"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg p-12 text-center">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-cream mb-2">No hay sesiones de control registradas</p>
          <p className="text-muted text-sm mb-4">Crea la primera sesión para comenzar el conteo de inventario</p>
          <Link href="/admin/control-stock/nuevo" className="text-gold hover:text-gold-light transition-colors">
            Nueva sesión →
          </Link>
        </div>
      )}
    </div>
  )
}
