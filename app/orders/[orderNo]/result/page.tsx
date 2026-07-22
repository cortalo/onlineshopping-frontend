import { redirect } from "next/navigation"
import { auth } from "@/auth"
import OrderResultClient from "./OrderResultClient"

export default async function OrderResultPage({
  params,
}: {
  params: Promise<{ orderNo: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { orderNo } = await params
  return <OrderResultClient orderNo={orderNo} token={session.backendToken} />
}
