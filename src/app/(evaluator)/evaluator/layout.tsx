import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/app/actions/auth'
import EvaluatorLayoutClient from './EvaluatorLayoutClient'

export default async function EvaluatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserWithRole()

  // Allow access to login page without authentication
  // If user exists but is not evaluator/admin, redirect to unauthorized
  if (user && user.role !== 'evaluator' && user.role !== 'admin') {
    redirect('/unauthorized')
  }

  // If user is evaluator/admin or no user (login page), render the layout
  return <EvaluatorLayoutClient user={user}>{children}</EvaluatorLayoutClient>
}
