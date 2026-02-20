export type UserRole = 'admin' | 'member'

export type Gender = 'male' | 'female'

export interface User {
  id: string
  email: string
  full_name: string
  phone: string | null
  role: UserRole
  gender: Gender | null
  start_date: string
  is_active: boolean
  created_at: string
}

export type PackageStatus = 'active' | 'completed' | 'expired'

export interface Package {
  id: string
  user_id: string
  total_lessons: number
  used_lessons: number
  start_date: string
  expire_date: string
  status: PackageStatus
  created_at: string
  // joined
  user?: User
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  package_id: string
  user_id: string
  date: string
  notes: string | null
  created_at: string
  // joined
  user?: User
  package?: Package
}

export interface Measurement {
  id: string
  user_id: string
  date: string
  weight: number | null
  height: number | null
  chest: number | null
  waist: number | null
  arm: number | null
  leg: number | null
  sf_chest: number | null
  sf_abdomen: number | null
  sf_thigh: number | null
  body_fat_pct: number | null
  created_at: string
  // joined
  user?: User
}

export type BlogPostStatus = 'draft' | 'published'

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  cover_image: string | null
  status: BlogPostStatus
  published_at: string | null
  created_at: string
}

export type WorkoutType = 'public' | 'member'

export interface WorkoutExercise {
  id: string
  workout_id: string
  order_num: number
  name: string
  sets: number | null
  reps: string | null
  weight: string | null
  rest: string | null
  notes: string | null
  superset_group: number | null
}

export interface Workout {
  id: string
  type: WorkoutType
  user_id: string | null
  week_start: string
  day_index: number
  title: string
  content: string | null
  created_at: string
  exercises?: WorkoutExercise[]
  user?: User
}

export type NotificationType = 'low_lessons' | 'weekly_report' | 'inactive' | 'manual'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  sent_at: string
}
