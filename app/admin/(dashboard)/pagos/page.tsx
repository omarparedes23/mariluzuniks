import Link from 'next/link'
import { getPayments, getPaymentSummary } from '@/lib/actions/payments'
import { Plus, CreditCard, Calendar, Scissors, User } from 'lucide-react'
import { DeletePaymentButton } from './components/DeletePaymentButton'
import { PaymentFilter } from './components/PaymentFilter'

interface PaymentsPageProps {
  searchParams: Promise<{ start?: string; end?: string }>
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const params = await searchParams
  const startDate = params.start
  const endDate = params.end

  const payments = await getPayments(startDate, endDate)
  const summary = await getPaymentSummary(startDate, endDate)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-2">Pagos</h1>
          <p className="text-muted">Registro de transacciones</p>
        </div>
        <Link
          href="/admin/pagos/nuevo"
          className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Registrar Pago
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-gold/20 rounded-lg p-4">
          <p className="text-muted text-sm mb-1">Total Período</p>
          <p className="font-serif text-2xl text-gold">S/ {summary.total.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-gold/20 rounded-lg p-4">
          <p className="text-muted text-sm mb-1">Efectivo</p>
          <p className="font-serif text-xl text-cream">S/ {summary.efectivo.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-gold/20 rounded-lg p-4">
          <p className="text-muted text-sm mb-1">Transferencia</p>
          <p className="font-serif text-xl text-cream">S/ {summary.transferencia.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter */}
      <PaymentFilter startDate={startDate} endDate={endDate} />

      {payments.length > 0 ? (
        <div className="bg-card border border-gold/20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left p-4 text-cream font-medium">Fecha</th>
                <th className="text-left p-4 text-cream font-medium">Cliente</th>
                <th className="text-left p-4 text-cream font-medium">Servicios</th>
                <th className="text-left p-4 text-cream font-medium">Método</th>
                <th className="text-right p-4 text-cream font-medium">Total</th>
                <th className="text-right p-4 text-cream font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gold/10 last:border-b-0">
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-cream text-sm">
                      <Calendar className="w-4 h-4 text-muted" />
                      {new Date(payment.fecha).toLocaleDateString('es-PE')}
                    </span>
                  </td>
                  <td className="p-4">
                    {payment.cliente_nombre ? (
                      <span className="flex items-center gap-1 text-cream">
                        <User className="w-4 h-4 text-gold" />
                        {payment.cliente_nombre}
                      </span>
                    ) : (
                      <span className="text-muted text-sm italic">Walk-in</span>
                    )}
                  </td>
                  <td className="p-4">
                    {payment.servicios && payment.servicios.length > 0 ? (
                      <div className="space-y-1">
                        {payment.servicios.map((ps, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm">
                            <Scissors className="w-3 h-3 text-muted" />
                            <span className="text-cream">
                              {ps.servicio?.nombre || 'Servicio eliminado'}
                            </span>
                            <span className="text-muted">
                              (S/ {Number(ps.precio_aplicado).toFixed(2)})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      payment.metodo_pago === 'efectivo'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      <CreditCard className="w-3 h-3" />
                      {payment.metodo_pago === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-cream font-medium">
                      S/ {Number(payment.monto_total).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <DeletePaymentButton paymentId={payment.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-gold/20 rounded-lg p-12 text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-cream mb-2">No hay pagos registrados</p>
          <p className="text-muted text-sm mb-4">Comienza registrando tu primer pago</p>
          <Link
            href="/admin/pagos/nuevo"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Registrar pago →
          </Link>
        </div>
      )}
    </div>
  )
}
