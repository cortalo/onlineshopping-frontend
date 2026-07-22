import { redirect } from "next/navigation"
import { auth } from "@/auth"
import OrderDetailClient from "./OrderDetailClient"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNo: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { orderNo } = await params
  return <OrderDetailClient orderNo={orderNo} token={session.backendToken} />
}
