'use client'

import { useState } from 'react'
import { Toaster } from 'sonner'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

interface AdminLayoutClientProps {
  children: React.ReactNode
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export default function AdminLayoutClient({
  children,
  user,
}: AdminLayoutClientProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="aw-admin flex min-h-screen flex-col">
      <AdminHeader user={user} onToggleNav={() => setNavOpen((open) => !open)} />
      <main className="aw-admin-main mx-auto w-full max-w-[1180px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <AdminSidebar
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        user={user}
      />
      <Toaster richColors position="top-right" />
    </div>
  )
}
