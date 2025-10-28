import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/app/actions/auth'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserWithRole()

  // Allow access to login page without authentication
  // Note: We can't access pathname in layout, so we check if user exists
  // If no user and trying to access admin area, middleware will redirect to login
  // If user exists but not admin, redirect to unauthorized
  if (user && user.role !== 'admin') {
    redirect('/unauthorized')
  }

  // If user is admin or no user (login page), render the layout
  // No user case will be handled by middleware redirecting to /admin/login
  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
}
