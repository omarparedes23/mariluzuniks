import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCompraById } from '@/lib/actions/purchases'
import { ArrowLeft, Truck, Calendar, FileText, CreditCard, Package, Pencil } from 'lucide-react'
import { DeleteCompraButton } from './DeleteCompraButton'

export default async function CompraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const compra = await getCompraById(id)

  if (!compra) notFound()

  const metodoLabels: Record<string, string> = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    yape: 'Yape',
  }

  const comprobanteLabels: Record<string, string> = {
    factura: 'Factura',
    boleta: 'Boleta',
    ticket: 'Ticket',
    sin_comprobante: 'Sin comprobante',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/compras" className="p-2 text-muted hover:text-cream transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl text-cream">Detalle de Compra</h1>
            <p className="text-muted">
              {new Date(compra.fecha + 'T00:00:00').toLocaleDateString('es-PE', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/compras/${compra.id}/editar`}
            className="flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold rounded hover:bg-gold/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Link>
          <DeleteCompraButton compraId={compra.id} compraFecha={compra.fecha} redirect />
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Header info */}
        <div className="bg-card border border-gold/20 rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-muted mt-0.5" />
              <div>
                <p className="text-muted text-sm">Proveedor</p>
                <p className="text-cream font-medium">{compra.proveedor?.nombre || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted mt-0.5" />
              <div>
                <p className="text-muted text-sm">Fecha</p>
                <p className="text-cream">{new Date(compra.fecha + 'T00:00:00').toLocaleDateString('es-PE')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted mt-0.5" />
              <div>
                <p className="text-muted text-sm">Comprobante</p>
                <p className="text-cream">{comprobanteLabels[compra.tipo_comprobante] || compra.tipo_comprobante}</p>
                {compra.numero_comprobante && (
                  <p className="text-gold text-sm">{compra.numero_comprobante}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-muted mt-0.5" />
              <div>
                <p className="text-muted text-sm">Método de pago</p>
                <p className="text-cream">{metodoLabels[compra.metodo_pago] || compra.metodo_pago}</p>
              </div>
            </div>
          </div>
          {compra.notas && (
            <div className="mt-4 pt-4 border-t border-gold/10">
              <p className="text-muted text-sm">Notas</p>
              <p className="text-cream mt-1">{compra.notas}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gold/20 flex items-center gap-2">
            <Package className="w-4 h-4 text-muted" />
            <h2 className="text-cream font-medium">Productos</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left p-4 text-muted text-sm font-medium">Producto</th>
                <th className="text-right p-4 text-muted text-sm font-medium">Cantidad</th>
                <th className="text-right p-4 text-muted text-sm font-medium">Precio unit.</th>
                <th className="text-right p-4 text-muted text-sm font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {compra.items?.map((item) => (
                <tr key={item.id} className="border-b border-gold/10 last:border-b-0">
                  <td className="p-4">
                    <p className="text-cream">{item.producto?.nombre || '—'}</p>
                    {item.producto?.codigo && (
                      <p className="text-muted text-xs">{item.producto.codigo}</p>
                    )}
                  </td>
                  <td className="p-4 text-right text-cream">{item.cantidad}</td>
                  <td className="p-4 text-right text-cream">S/ {Number(item.precio_unitario).toFixed(3)}</td>
                  <td className="p-4 text-right text-gold font-medium">S/ {Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gold/20">
                <td colSpan={3} className="p-4 text-right text-cream font-medium">Total</td>
                <td className="p-4 text-right font-serif text-xl text-gold">S/ {Number(compra.total).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
