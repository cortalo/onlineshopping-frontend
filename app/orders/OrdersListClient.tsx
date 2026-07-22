'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, CircleCheck, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { listOrders, formatPrice, type Order } from "@/lib/api"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function StatusBadge({ status }: { status: Order["status"] }) {
  if (status === 2) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
        <CircleCheck className="h-3.5 w-3.5" /> Paid
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
      <Clock className="h-3.5 w-3.5" /> Awaiting payment
    </span>
  )
}

export default function OrdersListClient({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    listOrders(token)
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load orders.")
        setLoading(false)
      })
  }, [token])

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-6">My Orders</h1>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-0.5">Browse products and place your first order.</p>
          </div>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Browse products
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="divide-y divide-border rounded-lg border border-border">
          {orders.map(order => (
            <Link
              key={order.orderNo}
              href={`/orders/${order.orderNo}`}
              className="flex items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-medium truncate">{order.productName}</span>
                <span className="text-xs text-muted-foreground font-mono">{order.orderNo}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                <span className="text-sm font-semibold">{formatPrice(order.amount)}</span>
                <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
