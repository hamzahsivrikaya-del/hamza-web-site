import { createClient } from '@/lib/supabase/server'
import PackageForm from './PackageForm'

export default async function NewPackagePage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from('users')
    .select('id, full_name, is_active')
    .eq('role', 'member')
    .order('is_active', { ascending: false })
    .order('full_name')

  return <PackageForm members={members || []} />
}
