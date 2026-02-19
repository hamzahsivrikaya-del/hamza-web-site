import { createClient } from '@/lib/supabase/server'
import LessonForm from './LessonForm'

export default async function NewLessonPage() {
  const supabase = await createClient()

  const { data: activePackages } = await supabase
    .from('packages')
    .select('id, user_id, total_lessons, used_lessons, users(full_name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // Supabase join tiplerini düzleştir
  const mapped = (activePackages || []).map((pkg) => ({
    id: pkg.id as string,
    user_id: pkg.user_id as string,
    total_lessons: pkg.total_lessons as number,
    used_lessons: pkg.used_lessons as number,
    userName: ((pkg.users as unknown as { full_name: string })?.full_name) || 'Bilinmeyen',
  }))

  return <LessonForm activePackages={mapped} />
}
