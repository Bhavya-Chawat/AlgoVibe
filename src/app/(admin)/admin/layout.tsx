import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/app/actions/auth'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserWithRole()

  // Verify admin access
  if (!user || user.role !== 'admin') {
    redirect('/unauthorized')
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
}
