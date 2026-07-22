// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductVariantGroup {
  label: string
  options: { value: string; available: boolean }[]
}

export interface Product {
  id: number
  name: string
  description: string
  price: number          // in cents, e.g. 59999 = $599.99
  totalStock: number
  availableStock: number
  imageUrl: string
  variants: ProductVariantGroup[]
}

export type OrderStatus =
  | 0   // out of stock — order could not be created
  | 1   // created, awaiting payment
  | 2   // paid, awaiting shipment
  | 99  // closed — payment timeout

export interface Order {
  orderNo: string
  status: OrderStatus
  productId: number
  productName: string
  amount: number         // in cents
  createdAt: string      // ISO string
  paidAt: string | null
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const currentUser: User = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+1 555-0123",
  address: "123 Main St, San Francisco, CA 94105",
}

// ─── Backend response type ────────────────────────────────────────────────────

interface CommodityResponse {
  id: number
  name: string
  description: string
  price: number
  available_stock: number
  total_stock: number
  image_url: string
}

function toProduct(c: CommodityResponse): Product {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    price: c.price,
    availableStock: c.available_stock,
    totalStock: c.total_stock,
    imageUrl: c.image_url,
    variants: [],
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function listProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/commodities`)
  if (!res.ok) throw new Error("Failed to fetch products")
  const data: CommodityResponse[] = await res.json()
  return data.map(toProduct)
}

export async function getProduct(id: number): Promise<Product | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/commodities/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Failed to fetch product")
  const data: CommodityResponse = await res.json()
  return toProduct(data)
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(_productId: number): Promise<Order> {
  throw new Error("Not implemented — waiting for orders backend")
}

export async function getOrder(_orderNo: string): Promise<Order | null> {
  throw new Error("Not implemented — waiting for orders backend")
}

export async function payOrder(_orderNo: string): Promise<Order> {
  throw new Error("Not implemented — waiting for orders backend")
}

export async function listOrders(): Promise<Order[]> {
  throw new Error("Not implemented — waiting for orders backend")
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getUser(): Promise<User> {
  return currentUser
}

export async function updateUser(data: Partial<Omit<User, "id">>): Promise<User> {
  Object.assign(currentUser, data)
  return currentUser
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
