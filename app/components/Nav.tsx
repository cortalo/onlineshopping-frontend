import Link from "next/link"
import Image from "next/image"
import { User, Package, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { auth, signOut } from "@/auth"

export default async function Nav() {
  const session = await auth()

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
            {session ? (
              <>
                <Link
                  href="/orders"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-1.5")}
                >
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </Link>
                <Link
                  href="/account"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-1.5")}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "avatar"}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{session.user?.name?.split(" ")[0]}</span>
                </Link>
                <Separator orientation="vertical" className="h-4" />
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }}
                >
                  <button
                    type="submit"
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-1.5")}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "default", size: "sm" }))}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
