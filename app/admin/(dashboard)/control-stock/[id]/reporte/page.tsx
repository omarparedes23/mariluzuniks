import { redirect } from 'next/navigation'
import { getControlResumen } from '@/lib/actions/control-stock'
import { ReporteContent } from './ReporteContent'

export default async function ReportePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resumen = await getControlResumen(id)

  if (!resumen) redirect(`/admin/control-stock/${id}`)

  return <ReporteContent resumen={resumen} />
}
