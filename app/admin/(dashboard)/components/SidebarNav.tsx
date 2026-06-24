'use client'

import {
  LayoutDashboard,
  Package,
  Scissors,
  CreditCard,
  Users,
  Receipt,
  Truck,
  ShoppingCart,
  ClipboardList,
  BookOpen,
} from 'lucide-react'
import NavLink from './NavLink'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/servicios', label: 'Servicios', icon: Scissors },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/pagos', label: 'Pagos', icon: CreditCard },
  { href: '/admin/gastos', label: 'Gastos', icon: Receipt },
  { href: '/admin/compras', label: 'Compras', icon: ShoppingCart },
  { href: '/admin/control-stock', label: 'Control Stock', icon: ClipboardList },
  { href: '/admin/proveedores', label: 'Proveedores', icon: Truck },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
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
