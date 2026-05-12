import { getServicesForSelect } from '@/lib/actions/payments'
import NewPaymentForm from './NewPaymentForm'

export default async function NewPaymentPage() {
  const services = await getServicesForSelect()
  return <NewPaymentForm services={services} />
}
