import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getControlSesionById } from '@/lib/actions/control-stock'
import { ArrowLeft, Calendar, FileText, BarChart2 } from 'lucide-react'
import { ControlGrid } from './ControlGrid'
import { CerrarSesionButton } from './CerrarSesionButton'
import { DeleteControlButton } from './DeleteControlButton'

const estadoLabels: Record<string, { label: string; className: string }> = {
  borrador: { label: 'En progreso', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' },
  cerrada: { label: 'Cerrada', className: 'bg-green-500/10 text-green-400 border border-green-500/30' },
}

export default async function ControlSesionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sesion = await getControlSesionById(id)

  if (!sesion) notFound()

  const estadoInfo = estadoLabels[sesion.estado] ?? { label: sesion.estado, className: 'bg-muted/10 text-muted' }

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/control-stock" className="p-2 text-muted hover:text-cream transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl text-cream">Sesión de Control</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoInfo.className}`}>
                {estadoInfo.label}
              </span>
            </div>
            <p className="text-muted mt-1">
              {formatDate(sesion.fecha_inicio)}
              {sesion.fecha_fin !== sesion.fecha_inicio && (
                <> → {formatDate(sesion.fecha_fin)}</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Session info card */}
      <div className="bg-card border border-gold/20 rounded-lg p-6 mb-6 max-w-3xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted mt-0.5" />
            <div>
              <p className="text-muted text-sm">Período</p>
              <p className="text-cream">
                {new Date(sesion.fecha_inicio + 'T00:00:00').toLocaleDateString('es-PE')}
                {' → '}
                {new Date(sesion.fecha_fin + 'T00:00:00').toLocaleDateString('es-PE')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-muted mt-0.5" />
            <div>
              <p className="text-muted text-sm">Productos</p>
              <p className="text-cream">{sesion.items.length} productos en esta sesión</p>
            </div>
          </div>
        </div>

        {sesion.notas && (
          <div className="mt-4 pt-4 border-t border-gold/10">
            <p className="text-muted text-sm">Notas</p>
            <p className="text-cream mt-1">{sesion.notas}</p>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="mb-8">
        <ControlGrid
          items={sesion.items}
          sesionId={sesion.id}
          estado={sesion.estado}
          fechaInicio={sesion.fecha_inicio}
          fechaFin={sesion.fecha_fin}
        />
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <CerrarSesionButton
          sesionId={sesion.id}
          items={sesion.items}
          estado={sesion.estado}
        />

        {sesion.estado === 'cerrada' && (
          <Link
            href={`/admin/control-stock/${sesion.id}/reporte`}
            className="flex items-center gap-2 px-6 py-3 border border-gold/40 text-gold rounded hover:bg-gold/10 transition-colors font-medium"
          >
            <BarChart2 className="w-4 h-4" />
            Ver reporte
          </Link>
        )}

        <DeleteControlButton sesionId={sesion.id} estado={sesion.estado} />
      </div>
    </div>
  )
}
