import { redirect } from 'next/navigation'
import { getCurrentUser } from './auth'

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (user.role !== 'admin') {
    redirect('/unauthorized')
  }
  
  return user
}

export async function requireEvaluator() {
  const user = await requireAuth()
  
  if (user.role !== 'evaluator' && user.role !== 'admin') {
    redirect('/unauthorized')
  }
  
  return user
}

export async function requireContestant() {
  const user = await requireAuth()
  
  if (user.role !== 'contestant') {
    redirect('/unauthorized')
  }
  
  return user
}
