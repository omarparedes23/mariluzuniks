import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/actions/products'
import EditProductForm from './EditProductForm'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} />
}
