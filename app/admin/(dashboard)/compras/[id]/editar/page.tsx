import { notFound } from 'next/navigation'
import { getCompraById } from '@/lib/actions/purchases'
import { getProducts } from '@/lib/actions/products'
import EditCompraForm from './EditCompraForm'

export default async function EditCompraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [compra, products] = await Promise.all([getCompraById(id), getProducts()])

  if (!compra) notFound()

  return <EditCompraForm compra={compra} products={products} />
}
