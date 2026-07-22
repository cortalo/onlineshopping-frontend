'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { CircleCheck, ShoppingBag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getOrder, formatPrice, type Order } from "@/lib/api"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrderResultClient({ orderNo, token }: { orderNo: string; token: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrder(orderNo, token)
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderNo, token])

  if (loading) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    )
  }

  if (!order || order.status !== 2) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Order not found or not yet paid.</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
      {/* Success icon */}
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-50 dark:bg-green-950">
        <CircleCheck className="h-8 w-8 text-green-500" />
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Payment successful</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your order has been confirmed and is being processed.
        </p>
      </div>

      {/* Order summary */}
      <div className="w-full rounded-lg border border-border divide-y divide-border text-left">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Order no.</span>
          <span className="text-sm font-mono">{order.orderNo}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Product</span>
          <span className="text-sm font-medium text-right max-w-[60%]">{order.productName}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Amount paid</span>
          <span className="text-sm font-semibold">{formatPrice(order.amount)}</span>
        </div>
        {order.paidAt && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Paid on</span>
            <span className="text-sm">{formatDate(order.paidAt)}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Actions */}
      <div className="w-full flex flex-col gap-2">
        <Link
          href={`/orders/${orderNo}`}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          View order details
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "w-full gap-2")}
        >
          <ShoppingBag className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
