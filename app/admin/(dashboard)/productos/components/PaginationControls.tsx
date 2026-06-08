import Link from 'next/link'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  total: number
  query: string
}

function buildHref(page: number, query: string): string {
  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return `/admin/productos${qs ? `?${qs}` : ''}`
}

export function PaginationControls({ currentPage, totalPages, total, query }: PaginationControlsProps) {
  if (total === 0) return null

  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gold/20">
      <span className="text-muted text-sm">
        {total} producto{total !== 1 ? 's' : ''} · Página {currentPage} de {totalPages}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {prevDisabled ? (
            <span className="px-3 py-1.5 text-sm text-muted border border-gold/10 rounded cursor-not-allowed">
              Anterior
            </span>
          ) : (
            <Link
              href={buildHref(currentPage - 1, query)}
              className="px-3 py-1.5 text-sm text-gold border border-gold/30 rounded hover:bg-gold/10 transition-colors"
            >
              Anterior
            </Link>
          )}
          {nextDisabled ? (
            <span className="px-3 py-1.5 text-sm text-muted border border-gold/10 rounded cursor-not-allowed">
              Siguiente
            </span>
          ) : (
            <Link
              href={buildHref(currentPage + 1, query)}
              className="px-3 py-1.5 text-sm text-gold border border-gold/30 rounded hover:bg-gold/10 transition-colors"
            >
              Siguiente
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
