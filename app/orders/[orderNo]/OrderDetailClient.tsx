'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CircleCheck, CircleAlert, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getOrder, payOrder, formatPrice, type Order, type OrderStatus } from "@/lib/api"

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  0: {
    label: "Out of stock",
    icon: <CircleAlert className="h-4 w-4 text-destructive" />,
    badge: "destructive",
  },
  1: {
    label: "Awaiting payment",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    badge: "outline",
  },
  2: {
    label: "Paid",
    icon: <CircleCheck className="h-4 w-4 text-green-500" />,
    badge: "outline",
  },
  99: {
    label: "Closed",
    icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
    badge: "secondary",
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

export default function OrderDetailClient({ orderNo }: { orderNo: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getOrder(orderNo).then(data => {
      setOrder(data)
      setLoading(false)
    })
  }, [orderNo])

  async function handlePay() {
    setPaying(true)
    setError("")
    try {
      await payOrder(orderNo)
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
        {/* Status */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Status</span>
          <div className="flex items-center gap-1.5">
            {status.icon}
            <span className="text-sm font-medium">{status.label}</span>
          </div>
        </div>

        {/* Order number */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Order no.</span>
          <span className="text-sm font-mono">{order.orderNo}</span>
        </div>

        {/* Product */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Product</span>
          <span className="text-sm font-medium text-right max-w-[60%]">{order.productName}</span>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-sm font-semibold">{formatPrice(order.amount)}</span>
        </div>

        {/* Created */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Placed on</span>
          <span className="text-sm">{formatDate(order.createdAt)}</span>
        </div>

        {/* Paid at */}
        {order.paidAt && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Paid on</span>
            <span className="text-sm">{formatDate(order.paidAt)}</span>
          </div>
        )}
      </div>

      {/* Out of stock message */}
      {order.status === 0 && (
        <p className="mt-4 text-sm text-destructive">
          This item was out of stock when your order was placed. No charge was made.
        </p>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {/* Pay button */}
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

      {/* Back to shopping */}
      {(order.status === 0 || order.status === 99) && (
        <div className="mt-6">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
            Browse products
          </Link>
        </div>
      )}
    </div>
  )
}
