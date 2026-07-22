import { notFound } from "next/navigation"
import { getProduct } from "@/lib/api"
import ProductDetailClient from "./ProductDetailClient"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(Number(id))
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
