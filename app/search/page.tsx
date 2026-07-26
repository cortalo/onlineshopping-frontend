import { searchProducts } from "@/lib/api"
import { ProductCard } from "@/app/components/ProductCard"

export const dynamic = "force-dynamic"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""

  let products = null
  let error = false

  if (query) {
    try {
      products = await searchProducts(query)
    } catch {
      error = true
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {query ? (
            <>Results for &ldquo;{query}&rdquo;</>
          ) : (
            "Enter a keyword above to search products."
          )}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          Something went wrong while searching. Please try again.
        </p>
      )}

      {!error && products && products.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No products match &ldquo;{query}&rdquo;. Try a different keyword.
        </p>
      )}

      {!error && products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
