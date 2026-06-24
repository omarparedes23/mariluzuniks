import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/actions/blog'
import EditBlogForm from './EditBlogForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()
  return <EditBlogForm post={post} />
}
