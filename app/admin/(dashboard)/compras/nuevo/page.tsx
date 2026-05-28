import { getProducts } from '@/lib/actions/products'
import NewCompraForm from './NewCompraForm'

export default async function NewCompraPage() {
  const products = await getProducts()
  return <NewCompraForm products={products} />
}
