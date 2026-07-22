import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { getProduct } from "@/lib/api"
import ProductDetailClient from "./ProductDetailClient"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params
  const product = await getProduct(Number(id))
  if (!product) notFound()

  return <ProductDetailClient product={product} token={session.backendToken} />
}
