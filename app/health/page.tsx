import { CircleCheck, CircleAlert } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HealthPage() {
  let available = false
  let message = ""

  try {
    const res = await fetch(`${process.env.API_URL}/api/health`)
    if (res.ok) {
      const data = await res.json()
      available = true
      message = data.message ?? ""
    }
  } catch {
    available = false
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
      <div
        className={`flex items-center justify-center h-16 w-16 rounded-full ${
          available ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
        }`}
      >
        {available ? (
          <CircleCheck className="h-8 w-8 text-green-500" />
        ) : (
          <CircleAlert className="h-8 w-8 text-destructive" />
        )}
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Backend {available ? "available" : "unavailable"}
        </h1>
        {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
        {!available && (
          <p className="text-sm text-muted-foreground mt-1">
            Could not reach <code className="text-xs">{process.env.API_URL}/api/health</code>
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        API URL: <code>{process.env.API_URL ?? "not set"}</code>
      </p>
    </div>
  )
}
