import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Package,
  Scissors,
  CreditCard,
  TrendingUp,
  Calendar,
  User,
  Receipt
} from 'lucide-react'
import { getExpenses } from '@/lib/actions/expenses'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Fetch counts
  const { count: productCount } = await supabase
    .from('uniks_productos')
    .select('*', { count: 'exact', head: true })

  const { count: serviceCount } = await supabase
    .from('uniks_servicios')
    .select('*', { count: 'exact', head: true })

  // Fetch today's payments
  const { data: todayPayments } = await supabase
    .from('uniks_pagos')
    .select('monto_total, metodo_pago')
    .gte('fecha', today.toISOString())
    .lt('fecha', tomorrow.toISOString())

  const todayTotal = todayPayments?.reduce((sum, p) => sum + Number(p.monto_total), 0) || 0
  const todayEfectivo = todayPayments
    ?.filter(p => p.metodo_pago === 'efectivo')
    .reduce((sum, p) => sum + Number(p.monto_total), 0) || 0
  const todayTransferencia = todayPayments
    ?.filter(p => p.metodo_pago === 'transferencia')
    .reduce((sum, p) => sum + Number(p.monto_total), 0) || 0

  // Fetch recent payments
  const { data: recentPayments } = await supabase
    .from('uniks_pagos')
    .select('id, monto_total, metodo_pago, fecha, cliente_nombre, servicios:uniks_pago_servicios(count)')
    .order('fecha', { ascending: false })
    .limit(5)

  // Fetch today's expenses
  const todayStr = today.toISOString().slice(0, 10)
  const todayExpensesList = await getExpenses({ startDate: todayStr, endDate: todayStr })
  const todayExpensesTotal = todayExpensesList.reduce((sum, e) => sum + Number(e.monto), 0)

  // Fetch monthly expenses and income
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthStartStr = monthStart.toISOString().slice(0, 10)

  const monthExpensesList = await getExpenses({ startDate: monthStartStr, endDate: todayStr })
  const monthExpensesTotal = monthExpensesList.reduce((sum, e) => sum + Number(e.monto), 0)

  const { data: monthPayments } = await supabase
    .from('uniks_pagos')
    .select('monto_total')
    .gte('fecha', monthStart.toISOString())
    .lt('fecha', tomorrow.toISOString())

  const monthIncomeTotal = monthPayments?.reduce((sum, p) => sum + Number(p.monto_total), 0) || 0
  const netProfit = monthIncomeTotal - monthExpensesTotal

  const stats = [
    {
      label: 'Productos',
      value: productCount || 0,
      icon: Package,
      href: '/admin/productos',
      color: 'text-blue-400',
    },
    {
      label: 'Servicios',
      value: serviceCount || 0,
      icon: Scissors,
      href: '/admin/servicios',
      color: 'text-purple-400',
    },
    {
      label: 'Ingresos Hoy',
      value: `S/ ${todayTotal.toFixed(2)}`,
      icon: TrendingUp,
      href: '/admin/pagos',
      color: 'text-green-400',
    },
    {
      label: 'Gastos Hoy',
      value: `S/ ${todayExpensesTotal.toFixed(2)}`,
      icon: Receipt,
      href: '/admin/gastos',
      color: 'text-red-400',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream mb-2">Dashboard</h1>
        <p className="text-muted">Resumen del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-gold/20 rounded-lg p-6 hover:border-gold/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm mb-1">{stat.label}</p>
                <p className="font-serif text-2xl text-cream">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Payments */}
        <div className="bg-card border border-gold/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl text-cream mb-1">Ingresos de Hoy</h2>
              <p className="text-muted text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {today.toLocaleDateString('es-PE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Link
              href="/admin/pagos/nuevo"
              className="bg-gold text-black px-4 py-2 rounded font-medium hover:bg-gold-light transition-colors"
            >
              + Registrar Pago
            </Link>
          </div>

          {todayTotal > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-bg rounded-lg p-4">
                <p className="text-muted text-sm mb-1">Total</p>
                <p className="font-serif text-2xl text-gold">S/ {todayTotal.toFixed(2)}</p>
              </div>
              <div className="bg-bg rounded-lg p-4">
                <p className="text-muted text-sm mb-1">Efectivo</p>
                <p className="font-serif text-xl text-cream">S/ {todayEfectivo.toFixed(2)}</p>
              </div>
              <div className="bg-bg rounded-lg p-4">
                <p className="text-muted text-sm mb-1">Transferencia</p>
                <p className="font-serif text-xl text-cream">S/ {todayTransferencia.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay pagos registrados hoy</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-gold/20 rounded-lg p-6">
          <h2 className="font-serif text-xl text-cream mb-4">Pagos Recientes</h2>

          {recentPayments && recentPayments.length > 0 ? (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gold/10 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      payment.metodo_pago === 'efectivo'
                        ? 'bg-green-500/20'
                        : 'bg-blue-500/20'
                    }`}>
                      <CreditCard className={`w-4 h-4 ${
                        payment.metodo_pago === 'efectivo'
                          ? 'text-green-400'
                          : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-cream text-sm flex items-center gap-1">
                        <User className="w-3 h-3 text-muted" />
                        {payment.cliente_nombre || 'Walk-in'}
                      </p>
                      <p className="text-muted text-xs">
                        {new Date(payment.fecha).toLocaleTimeString('es-PE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {' · '}
                        {payment.metodo_pago === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gold font-medium">
                    S/ {Number(payment.monto_total).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted">
              <p>No hay pagos recientes</p>
            </div>
          )}

          <Link
            href="/admin/pagos"
            className="block text-center text-gold text-sm mt-4 hover:text-gold-light transition-colors"
          >
            Ver todos los pagos →
          </Link>
        </div>

        {/* Monthly Profit */}
        <div className="bg-card border border-gold/20 rounded-lg p-6">
          <h2 className="font-serif text-xl text-cream mb-4">Resumen Mensual</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gold/10">
              <span className="text-muted">Ingresos del mes</span>
              <span className="text-green-400 font-medium">
                S/ {monthIncomeTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gold/10">
              <span className="text-muted">Gastos del mes</span>
              <span className="text-red-400 font-medium">
                S/ {monthExpensesTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-cream font-medium">Utilidad neta</span>
              <span className={`font-serif text-xl ${netProfit >= 0 ? 'text-gold' : 'text-red-400'}`}>
                S/ {netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-4 bg-card border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition-colors"
        >
          <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-cream font-medium">Agregar Producto</p>
            <p className="text-muted text-sm">Añadir nuevo producto al inventario</p>
          </div>
        </Link>

        <Link
          href="/admin/servicios/nuevo"
          className="flex items-center gap-4 bg-card border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition-colors"
        >
          <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
            <Scissors className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-cream font-medium">Agregar Servicio</p>
            <p className="text-muted text-sm">Crear nuevo servicio del salón</p>
          </div>
        </Link>

        <Link
          href="/admin/gastos/nuevo"
          className="flex items-center gap-4 bg-card border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition-colors"
        >
          <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-cream font-medium">Registrar Gasto</p>
            <p className="text-muted text-sm">Añadir un nuevo gasto del negocio</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
