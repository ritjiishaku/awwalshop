import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/login')
  }

  return (
    <AdminLayoutClient user={session.user}>
      {children}
    </AdminLayoutClient>
  )
}

