import Link from "next/link"
import { User, Package } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="font-semibold text-lg tracking-tight">
            ShopHub
          </Link>

          {/* Search */}
          <div className="hidden sm:flex flex-1 max-w-sm mx-8">
            <input
              type="text"
              placeholder="Search products…"
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <Link
              href="/orders"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-1.5")}
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/account"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-1.5")}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
