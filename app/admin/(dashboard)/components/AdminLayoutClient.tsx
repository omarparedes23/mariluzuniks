'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, User, Menu, X } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import SidebarNav from './SidebarNav'

interface AdminLayoutClientProps {
  userEmail: string
  children: React.ReactNode
}

export default function AdminLayoutClient({ userEmail, children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed h-full z-50 w-64 bg-card border-r border-gold/20 flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gold/20 flex items-center justify-between">
          <Link href="/admin" className="block">
            <h1 className="font-serif text-xl text-gold">Unik&apos;s Salon</h1>
            <p className="text-xs text-muted mt-1">Panel Admin</p>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted hover:text-gold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <SidebarNav />

        <div className="p-4 border-t border-gold/20">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-cream truncate">{userEmail}</p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-cream/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Header móvil */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-gold/20 bg-card sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gold hover:text-gold/80"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-gold text-lg">Unik&apos;s Salon</span>
        </div>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
