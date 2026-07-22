'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CircleCheck, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getOrder, payOrder, formatPrice, type Order, type OrderStatus } from "@/lib/api"

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode }
> = {
  1: {
    label: "Awaiting payment",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
  },
  2: {
    label: "Paid",
    icon: <CircleCheck className="h-4 w-4 text-green-500" />,
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrderDetailClient({ orderNo, token }: { orderNo: string; token: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getOrder(orderNo, token)
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderNo, token])

  async function handlePay() {
    setPaying(true)
    setError("")
    try {
      await payOrder(orderNo, token)
      router.push(`/orders/${orderNo}/result`)
    } catch {
      setError("Payment failed. Please try again.")
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          Back to products
        </Link>
      </div>
    )
  }

  const status = statusConfig[order.status]

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      <h1 className="text-xl font-semibold tracking-tight mb-6">Order summary</h1>

      <div className="rounded-lg border border-border divide-y divide-border">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Status</span>
          <div className="flex items-center gap-1.5">
            {status.icon}
            <span className="text-sm font-medium">{status.label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Order no.</span>
          <span className="text-sm font-mono">{order.orderNo}</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Product</span>
          <span className="text-sm font-medium text-right max-w-[60%]">{order.productName}</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-sm font-semibold">{formatPrice(order.amount)}</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Placed on</span>
          <span className="text-sm">{formatDate(order.createdAt)}</span>
        </div>

        {order.paidAt && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Paid on</span>
            <span className="text-sm">{formatDate(order.paidAt)}</span>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {order.status === 1 && (
        <div className="mt-6">
          <Separator className="mb-6" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Total due</span>
            <span className="text-xl font-bold">{formatPrice(order.amount)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={handlePay} disabled={paying}>
            {paying ? "Processing…" : `Pay ${formatPrice(order.amount)}`}
          </Button>
        </div>
      )}
    </div>
  )
}
