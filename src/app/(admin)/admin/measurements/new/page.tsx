import { createClient } from '@/lib/supabase/server'
import MeasurementForm from './MeasurementForm'

export default async function NewMeasurementPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('role', 'member')
    .eq('is_active', true)
    .order('full_name')

  return <MeasurementForm members={members || []} />
}
