import { redirect } from "next/navigation"
import { auth } from "@/auth"
import AccountClient from "./AccountClient"

export default async function AccountPage() {
  const session = await auth()
  if (!session) redirect("/login")
  return <AccountClient token={session.backendToken} />
}
