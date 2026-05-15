'use client'

import {
  LayoutDashboard,
  Package,
  Scissors,
  CreditCard,
  Users,
  Receipt,
  Truck
} from 'lucide-react'
import NavLink from './NavLink'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/servicios', label: 'Servicios', icon: Scissors },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/pagos', label: 'Pagos', icon: CreditCard },
  { href: '/admin/gastos', label: 'Gastos', icon: Receipt },
  { href: '/admin/proveedores', label: 'Proveedores', icon: Truck },
]

export default function SidebarNav() {
  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </nav>
  )
}
