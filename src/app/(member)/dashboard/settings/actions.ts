'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateProfile(fullName: string, phone: string) {
  // Kullanıcı kimliğini doğrula
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Yetkisiz')

  // Güncellemeyi admin client ile yap (RLS bypass — sadece izin verilen alanlar)
  const admin = createAdminClient()
  const { error } = await admin
    .from('users')
    .update({ full_name: fullName.trim(), phone })
    .eq('id', user.id)

  if (error) throw new Error('Güncelleme başarısız')

  revalidatePath('/dashboard', 'layout')
}
