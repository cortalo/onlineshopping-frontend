'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getUser, updateUser, type User } from "@/lib/api"

const schema = z.object({
  name:    z.string().min(1, "Name is required"),
  email:   z.string().email("Invalid email address"),
  phone:   z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
})
type FormValues = z.infer<typeof schema>

function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground select-none">
      {letters}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export default function AccountClient() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    getUser().then(data => {
      setUser(data)
      reset(data)
      setLoading(false)
    })
  }, [reset])

  async function onSubmit(values: FormValues) {
    setSaving(true)
    const updated = await updateUser(values)
    setUser(updated)
    setEditing(false)
    setSaving(false)
  }

  function handleCancel() {
    if (user) reset(user)
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Account</h1>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-6">
        <Initials name={user.name} />
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator className="mb-6" />

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <Field label="Full name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.phone} />
          <Field label="Address" value={user.address} />
        </div>
      )}
    </div>
  )
}
