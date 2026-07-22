import { redirect } from "next/navigation"
import { auth } from "@/auth"
import OrdersListClient from "./OrdersListClient"

export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect("/login")
  return <OrdersListClient token={session.backendToken} />
}
