import { createClient } from '@/lib/supabase/server'
import WorkoutManager from './WorkoutManager'
import { getMonday } from '@/lib/utils'
import type { Workout, User } from '@/lib/types'

export default async function AdminWorkoutsPage() {
  const supabase = await createClient()
  const monday = getMonday()

  const [{ data: workouts }, { data: members }] = await Promise.all([
    supabase
      .from('workouts')
      .select('*, exercises:workout_exercises(*)')
      .eq('type', 'public')
      .eq('week_start', monday)
      .order('day_index'),
    supabase
      .from('users')
      .select('id, full_name, email')
      .eq('role', 'member')
      .eq('is_active', true)
      .order('full_name'),
  ])

  return (
    <WorkoutManager
      initialWorkouts={(workouts as Workout[]) || []}
      members={(members as User[]) || []}
      initialWeek={monday}
    />
  )
}
