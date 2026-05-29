'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold rounded hover:bg-gold/10 transition-colors"
    >
      Imprimir
    </button>
  )
}
