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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-shell min-h-screen text-espresso">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      <div className="flex min-h-screen flex-col lg:pl-[17rem]">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          user={user}
        />
        <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
