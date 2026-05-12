'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/lib/actions/auth'
import { Lock, Mail, ArrowRight } from 'lucide-react'

function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin'

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-gold/20 rounded-lg p-8">
      <h2 className="font-serif text-xl text-cream mb-6 text-center">
        Iniciar Sesión
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-cream/80 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-bg border border-gold/30 rounded px-10 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
              placeholder="admin@uniks.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-cream/80 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-bg border border-gold/30 rounded px-10 py-3 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-black font-medium py-3 px-4 rounded hover:bg-gold-light active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            'Ingresando...'
          ) : (
            <>
              Ingresar
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-gold mb-2">
            Unik&apos;s Salon Spa
          </h1>
          <p className="text-muted">Panel de Administración</p>
        </div>

        <Suspense fallback={<div className="bg-card border border-gold/20 rounded-lg p-8 text-center text-muted">Cargando...</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-muted text-sm mt-6">
          © {new Date().getFullYear()} Unik&apos;s Salon Spa
        </p>
      </div>
    </div>
  )
}
