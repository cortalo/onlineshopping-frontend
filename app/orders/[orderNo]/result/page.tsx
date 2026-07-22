import OrderResultClient from "./OrderResultClient"

export default async function OrderResultPage({
  params,
}: {
  params: Promise<{ orderNo: string }>
}) {
  const { orderNo } = await params
  return <OrderResultClient orderNo={orderNo} />
}
