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

let products: Product[] = [
  {
    id: 1,
    name: "ProPhone 15 — 128GB",
    description: "The latest flagship smartphone with a 6.1-inch Super Retina display, 48MP camera system, and all-day battery life.",
    price: 79999,
    totalStock: 200,
    availableStock: 47,
    imageUrl: "https://picsum.photos/seed/phone15/400/300",
    variants: [
      { label: "Color", options: [{ value: "Midnight", available: true }, { value: "Starlight", available: true }, { value: "Blue", available: false }] },
      { label: "Storage", options: [{ value: "128 GB", available: true }, { value: "256 GB", available: true }, { value: "512 GB", available: false }] },
    ],
  },
  {
    id: 2,
    name: 'UltraBook Pro 14"',
    description: "Slim 14-inch laptop with a 12-core processor, 16 GB RAM, and a stunning OLED display. Built for professionals.",
    price: 129999,
    totalStock: 100,
    availableStock: 12,
    imageUrl: "https://picsum.photos/seed/laptop14/400/300",
    variants: [
      { label: "Color", options: [{ value: "Space Gray", available: true }, { value: "Silver", available: true }] },
      { label: "RAM", options: [{ value: "16 GB", available: true }, { value: "32 GB", available: true }] },
    ],
  },
  {
    id: 3,
    name: "SoundPod Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation, 30-hour total battery, and a custom-tuned driver for rich audio.",
    price: 19999,
    totalStock: 500,
    availableStock: 213,
    imageUrl: "https://picsum.photos/seed/earbuds/400/300",
    variants: [
      { label: "Color", options: [{ value: "White", available: true }, { value: "Black", available: true }, { value: "Navy", available: true }] },
    ],
  },
  {
    id: 4,
    name: 'ViewPad Air 11"',
    description: "Lightweight 11-inch tablet with an ultra-bright display, perfect for work and entertainment on the go.",
    price: 54999,
    totalStock: 150,
    availableStock: 68,
    imageUrl: "https://picsum.photos/seed/tablet11/400/300",
    variants: [
      { label: "Color", options: [{ value: "Silver", available: true }, { value: "Rose Gold", available: true }] },
      { label: "Storage", options: [{ value: "64 GB", available: true }, { value: "256 GB", available: true }] },
    ],
  },
  {
    id: 5,
    name: "FitBand Pro Smartwatch",
    description: "Advanced health and fitness tracker with ECG monitoring, GPS, sleep tracking, and a 7-day battery.",
    price: 29999,
    totalStock: 300,
    availableStock: 5,
    imageUrl: "https://picsum.photos/seed/watch5/400/300",
    variants: [
      { label: "Case Size", options: [{ value: "41mm", available: true }, { value: "45mm", available: true }] },
      { label: "Band", options: [{ value: "Sport Band", available: true }, { value: "Leather Band", available: false }] },
    ],
  },
  {
    id: 6,
    name: "SnapCam Mirrorless Camera",
    description: "24MP mirrorless camera with 4K video, in-body stabilization, and a weather-sealed body. Ideal for enthusiasts.",
    price: 89999,
    totalStock: 80,
    availableStock: 31,
    imageUrl: "https://picsum.photos/seed/camera6/400/300",
    variants: [
      { label: "Kit", options: [{ value: "Body Only", available: true }, { value: "With 18-55mm Lens", available: true }] },
    ],
  },
]

let orders: Order[] = []

const currentUser: User = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+1 555-0123",
  address: "123 Main St, San Francisco, CA 94105",
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function listProducts(): Promise<Product[]> {
  return products
}

export async function getProduct(id: number): Promise<Product | null> {
  return products.find(p => p.id === id) ?? null
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(productId: number): Promise<Order> {
  const product = products.find(p => p.id === productId)
  if (!product) throw new Error("Product not found")

  if (product.availableStock <= 0) {
    const order: Order = {
      orderNo: `ORD-${Date.now()}`,
      status: 0,
      productId,
      productName: product.name,
      amount: product.price,
      createdAt: new Date().toISOString(),
      paidAt: null,
    }
    orders = [...orders, order]
    return order
  }

  // Lock stock and create order
  products = products.map(p =>
    p.id === productId ? { ...p, availableStock: p.availableStock - 1 } : p
  )

  const order: Order = {
    orderNo: `ORD-${Date.now()}`,
    status: 1,
    productId,
    productName: product.name,
    amount: product.price,
    createdAt: new Date().toISOString(),
    paidAt: null,
  }
  orders = [...orders, order]
  return order
}

export async function getOrder(orderNo: string): Promise<Order | null> {
  return orders.find(o => o.orderNo === orderNo) ?? null
}

export async function payOrder(orderNo: string): Promise<Order> {
  const order = orders.find(o => o.orderNo === orderNo)
  if (!order) throw new Error("Order not found")
  if (order.status !== 1) throw new Error("Order is not awaiting payment")

  const updated: Order = { ...order, status: 2, paidAt: new Date().toISOString() }
  orders = orders.map(o => o.orderNo === orderNo ? updated : o)
  return updated
}

export async function listOrders(): Promise<Order[]> {
  return [...orders].reverse()
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
