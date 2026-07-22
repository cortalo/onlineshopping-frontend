# Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **shadcn/ui** — UI components. Use these instead of hand-writing buttons, inputs, cards, dialogs.
- **Lucide React** — icons. Use these instead of emojis in the UI.
- **React Hook Form + Zod** — form state and validation
- **Auth.js v5** (next-auth) — Google OAuth
- **Vercel** — deployment

The libraries listed above are the chosen stack — stick to them. Feel free to add other standard libraries on top when needed.

# UI Style

The app should look like it came from a professional team — clean, neutral, consistent. Functionality comes first, but UI quality matters.

**Components:** *(strict)* Use shadcn/ui for all interactive elements (buttons, inputs, dialogs, cards). Do not hand-write these from scratch. Mixing shadcn with custom HTML produces inconsistent results.

**Icons:** *(strict)* Use Lucide React for all icons. Never use emoji as icons in the UI.

**Colors:** *(guideline)* Prefer neutral grays (Tailwind `zinc` or `slate` scale) for most UI. Use one accent color sparingly and consistently. Semantic colors (red for errors, green for success) are fine where appropriate.

**States:** Every data-fetching interaction must handle:
- Loading — *(strict)* use a skeleton or spinner, not plain "Loading…" text
- Error — *(strict)* show a clear inline message near the relevant content
- Empty — *(guideline)* show a helpful message explaining what to do next when it adds value

**Spacing and shape:** *(guideline)* Prefer consistent spacing and avoid excessive rounding — `rounded-md` or `rounded-lg` is usually enough. Reserve `rounded-full` for avatars and pill badges only.

# Working Style

For any non-trivial task:

1. **Plan first.** List the steps before writing any code. Wait for confirmation before starting.
2. **One step at a time.** Complete one step, then stop. The user will commit, test, and say when to continue.
3. **Never finish the whole task in one go.** Even if the steps seem straightforward, do them one at a time.

Product requirements or feature descriptions may come from a non-technical source. Flag any requirements that conflict with good software design practice and suggest a better approach before implementing.

# Project Structure

```
app/
  animals/            # feature pages (list, detail, new)
  components/         # shared components (Nav, etc.)
  login/
  page.tsx            # landing page
lib/
  api.ts              # all data functions
auth.ts               # Auth.js config
```

New feature pages go under `app/<feature>/`. Shared components go under `app/components/`.

# Auth Pattern

Every protected page uses a two-file pattern:

- `page.tsx` (Server Component) — calls `auth()`, redirects to `/login` if not logged in, passes `token` as a prop to the client component. No UI here.
- `*Client.tsx` (Client Component) — receives `token` as a prop, handles all UI and data fetching.

Never call `auth()` inside a `'use client'` component — this is a hard technical constraint, not a preference. The two-file pattern itself is a guideline; use judgment if a specific case calls for a different approach.

# Data Access Rule

> **This is the most important rule in this file.** It is what makes the frontend and backend independently developable.

All data reads/writes must go through `lib/api.ts`. Never call `fetch()`
directly inside components/pages.

AI coding only covers **Phase 1**. Phase 2 is done manually by the developer when the real backend is ready.

**Phase 1 — in-memory mock (AI writes this).** All functions in `lib/api.ts` operate on a module-level array. No real HTTP calls.

```typescript
// lib/api.ts
let animals: Animal[] = [{ id: 1, name: 'Cat' }, { id: 2, name: 'Dog' }]
let nextId = 3

export async function getAnimals(): Promise<Animal[]> {
  return animals
}

export async function createAnimal(name: string): Promise<Animal> {
  const animal = { id: nextId++, name }
  animals = [...animals, animal]
  return animal
}

export async function updateAnimal(id: number, name: string): Promise<Animal> {
  animals = animals.map(a => a.id === id ? { ...a, name } : a)
  return animals.find(a => a.id === id)!
}

export async function deleteAnimal(id: number): Promise<void> {
  animals = animals.filter(a => a.id !== id)
}
```

**Phase 2 — real backend (developer writes this manually).** Replace only the function bodies in `lib/api.ts` with real `fetch()` calls. Components and pages never change between phases.

```typescript
export async function getAnimals(): Promise<Animal[]> {
  const res = await fetch(`${BASE}/api/animals`, { headers: authHeaders(token) })
  return res.json()
}
```