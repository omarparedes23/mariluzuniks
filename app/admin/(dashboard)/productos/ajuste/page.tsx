import { getProducts } from '@/lib/actions/products'
import AjusteStockForm from './AjusteStockForm'

export default async function AjusteStockPage() {
  const products = await getProducts()
  return <AjusteStockForm products={products} />
}
