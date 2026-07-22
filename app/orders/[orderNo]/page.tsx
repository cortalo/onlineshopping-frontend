import OrderDetailClient from "./OrderDetailClient"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNo: string }>
}) {
  const { orderNo } = await params
  return <OrderDetailClient orderNo={orderNo} />
}
