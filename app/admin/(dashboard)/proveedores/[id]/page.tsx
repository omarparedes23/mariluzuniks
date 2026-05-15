import { notFound } from 'next/navigation'
import { getProveedorById } from '@/lib/actions/proveedores'
import EditProveedorPageClient from './EditProveedorPageClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProveedorPage({ params }: Props) {
  const { id } = await params
  const proveedor = await getProveedorById(id)

  if (!proveedor) {
    notFound()
  }

  return <EditProveedorPageClient proveedor={proveedor} />
}
