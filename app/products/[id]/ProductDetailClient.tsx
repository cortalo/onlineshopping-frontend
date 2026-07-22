'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createOrder, formatPrice, type Product } from "@/lib/api"

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>
  if (stock <= 20) return <Badge variant="outline" className="text-amber-600 border-amber-300">Low stock — {stock} left</Badge>
  return <span className="text-sm text-muted-foreground">{stock} in stock</span>
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter()
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      product.variants.map(group => [
        group.label,
        group.options.find(o => o.available)?.value ?? "",
      ])
    )
  )
  const [quantity, setQuantity] = useState(1)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState("")

  async function handleBuy() {
    setBuying(true)
    setError("")
    try {
      const order = await createOrder(product.id)
      if (order.status === 0) {
        setError("Sorry, this item just went out of stock.")
        setBuying(false)
        return
      }
      router.push(`/orders/${order.orderNo}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setBuying(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              <StockBadge stock={product.availableStock} />
            </div>
          </div>

          <Separator />

          {/* Variant selectors */}
          {product.variants.map(group => (
            <div key={group.label}>
              <p className="text-sm font-medium mb-2">
                {group.label}:{" "}
                <span className="font-normal text-muted-foreground">
                  {selectedVariants[group.label]}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {group.options.map(option => {
                  const selected = selectedVariants[group.label] === option.value
                  return (
                    <button
                      key={option.value}
                      disabled={!option.available}
                      onClick={() =>
                        setSelectedVariants(prev => ({ ...prev, [group.label]: option.value }))
                      }
                      className={`px-3 py-1.5 rounded-md border text-sm transition-colors
                        ${selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                        }
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border`}
                    >
                      {option.value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <Separator />

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.availableStock, q + 1))}
                className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Buy button */}
          <Button
            size="lg"
            onClick={handleBuy}
            disabled={buying || product.availableStock === 0}
            className="w-full"
          >
            {buying ? "Processing…" : product.availableStock === 0 ? "Out of stock" : "Buy now"}
          </Button>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-sm font-medium mb-2">About this product</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
