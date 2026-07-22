import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { listProducts, formatPrice, type Product } from "@/lib/api"

export const dynamic = "force-dynamic"

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>
  if (stock <= 20) return <Badge variant="outline" className="text-amber-600 border-amber-300">Low stock — {stock} left</Badge>
  return <span className="text-xs text-muted-foreground">{stock} in stock</span>
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <CardContent className="flex-1 pt-4 space-y-2">
        <h2 className="font-medium text-sm leading-snug">{product.name}</h2>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-semibold text-base">{formatPrice(product.price)}</span>
          <StockBadge stock={product.availableStock} />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={product.availableStock === 0}
        >
          <Link href={`/products/${product.id}`} className="w-full">
            {product.availableStock === 0 ? "Sold out" : "View details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default async function HomePage() {
  const products = await listProducts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground mt-1">Limited stock — order before it runs out.</p>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
