// Shared, serialisable taxonomy shapes for the storefront.
// Kept separate from `lib/storefront.ts` so client components can import the
// types without pulling in the server-only Prisma module.

export interface CategoryNavChild {
  name: string
  slug: string
  count: number
}

export interface CategoryNavItem extends CategoryNavChild {
  imageUrl?: string | null
  children: CategoryNavChild[]
}
