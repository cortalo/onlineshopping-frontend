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
  | 1   // created, awaiting payment
  | 2   // paid

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

export class OutOfStockError extends Error {
  constructor() { super("Out of stock") }
}

// ─── Backend response types ───────────────────────────────────────────────────

interface OrderResponse {
  order_no: string
  status: number
  commodity_id: number
  product_name: string
  amount: number
  create_time: string
  pay_time: string | null
}

function toOrder(r: OrderResponse): Order {
  return {
    orderNo: r.order_no,
    status: r.status as OrderStatus,
    productId: r.commodity_id,
    productName: r.product_name,
    amount: r.amount,
    createdAt: r.create_time,
    paidAt: r.pay_time,
  }
}

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
}

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

export async function createOrder(productId: number, token: string): Promise<Order> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product_id: productId }),
  })
  if (res.status === 409) throw new OutOfStockError()
  if (!res.ok) throw new Error("Failed to create order")
  return toOrder(await res.json())
}

export async function getOrder(orderNo: string, token: string): Promise<Order | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderNo}`, {
    headers: authHeaders(token),
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Failed to fetch order")
  return toOrder(await res.json())
}

export async function payOrder(orderNo: string, token: string): Promise<Order> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderNo}/pay`, {
    method: "POST",
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error("Failed to pay order")
  return toOrder(await res.json())
}

export async function listOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error("Failed to fetch orders")
  const data: OrderResponse[] = await res.json()
  return data.map(toOrder)
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getUser(token: string): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

export async function updateUser(data: Omit<User, "id">, token: string): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update user")
  return res.json()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
