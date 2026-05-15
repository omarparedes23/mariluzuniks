import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { LogOut, User } from 'lucide-react'
import SidebarNav from './components/SidebarNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-gold/20 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gold/20">
          <Link href="/admin" className="block">
            <h1 className="font-serif text-xl text-gold">Unik&apos;s Salon</h1>
            <p className="text-xs text-muted mt-1">Panel Admin</p>
          </Link>
        </div>

        <SidebarNav />

        <div className="p-4 border-t border-gold/20">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-cream truncate">{user.email}</p>
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

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
