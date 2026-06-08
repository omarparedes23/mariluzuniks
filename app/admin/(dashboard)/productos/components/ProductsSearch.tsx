'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTransition, useEffect, useState, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface ProductsSearchProps {
  initialQuery: string
}

export function ProductsSearch({ initialQuery }: ProductsSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [value, setValue] = useState(initialQuery)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const current = searchParams.get('q') ?? ''
      if (value.trim() === current.trim()) return

      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }
      params.delete('page')

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, pathname, router, searchParams])

  function handleClear() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Buscar por nombre..."
        className="w-full bg-bg border border-gold/30 rounded px-4 py-2 pl-9 pr-9 text-cream placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
