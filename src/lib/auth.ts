import { createClient } from './supabase/server'
import { createAdminClient } from './supabase/server'

export async function getUserRole(email: string): Promise<'admin' | 'evaluator' | 'contestant'> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('email', email)
    .single()

  if (error || !data) {
    return 'contestant'
  }

  return data.role as 'admin' | 'evaluator' | 'contestant'
}

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  const role = await getUserRole(user.email!)
  
  return {
    ...user,
    role
  }
}
