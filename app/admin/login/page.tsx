import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { safeAdminCallbackUrl } from '@/lib/safe-admin-callback'

interface AdminLoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string | string[]
    error?: string | string[]
  }>
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams

  return (
    <AdminLoginForm
      callbackUrl={safeAdminCallbackUrl(firstValue(params.callbackUrl))}
      authError={firstValue(params.error)}
    />
  )
}
