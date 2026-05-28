import Link from 'next/link'
import { getCompras } from '@/lib/actions/purchases'
import { Plus, ShoppingCart, Truck, Eye, Pencil } from 'lucide-react'
import { DeleteCompraButton } from './[id]/DeleteCompraButton'

export default async function ComprasPage() {
  const compras = await getCompras()

  const comprobanteLabels: Record<string, string> = {
    factura: 'Factura',
    boleta: 'Boleta',
    ticket: 'Ticket',
    sin_comprobante: 'Sin comprobante',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Compras</h1>
          <p className="text-muted">Registro de compras a proveedores</p>
        </div>
        <Link
          href="/admin/compras/nuevo"
          className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Compra
        </Link>
      </div>

      {compras.length > 0 ? (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left p-4 text-cream font-medium">Fecha</th>
                <th className="text-left p-4 text-cream font-medium">Proveedor</th>
                <th className="text-left p-4 text-cream font-medium">Comprobante</th>
                <th className="text-left p-4 text-cream font-medium">Items</th>
                <th className="text-left p-4 text-cream font-medium">Total</th>
                <th className="text-right p-4 text-cream font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id} className="border-b border-gold/10 last:border-b-0">
                  <td className="p-4 text-cream">
                    {new Date(compra.fecha + 'T00:00:00').toLocaleDateString('es-PE')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-muted shrink-0" />
                      <span className="text-cream">{compra.proveedor?.nombre || '—'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-muted text-sm">{comprobanteLabels[compra.tipo_comprobante]}</p>
                    {compra.numero_comprobante && (
                      <p className="text-cream text-sm">{compra.numero_comprobante}</p>
                    )}
                  </td>
                  <td className="p-4 text-muted text-sm">
                    {compra.items?.length || 0} producto(s)
                  </td>
                  <td className="p-4 text-gold font-medium">
                    S/ {Number(compra.total).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/compras/${compra.id}`}
                        className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/compras/${compra.id}/editar`}
                        className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteCompraButton compraId={compra.id} compraFecha={compra.fecha} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg p-12 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-cream mb-2">No hay compras registradas</p>
          <p className="text-muted text-sm mb-4">Registra la primera compra de insumos</p>
          <Link href="/admin/compras/nuevo" className="text-gold hover:text-gold-light transition-colors">
            Registrar compra →
          </Link>
        </div>
      )}
    </div>
  )
}
