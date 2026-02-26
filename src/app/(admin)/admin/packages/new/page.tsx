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

  // Aktif paketi olan üyelerin ID'lerini bul
  const { data: activePackages } = await supabase
    .from('packages')
    .select('user_id')
    .eq('status', 'active')

  const activePackageUserIds = new Set((activePackages || []).map((p) => p.user_id))

  const membersWithPackageInfo = (members || []).map((m) => ({
    ...m,
    hasActivePackage: activePackageUserIds.has(m.id),
  }))

  return <PackageForm members={membersWithPackageInfo} />
}
