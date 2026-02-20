import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Admin kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await request.json()
  const { email, password, full_name, phone, gender } = body

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
  }

  // Service role key ile admin client kullan
  const adminClient = createAdminClient()
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { full_name, role: 'member' },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Profil güncelle (trigger otomatik oluşturur ama phone + gender ekleyelim)
  const profileUpdate: Record<string, string> = {}
  if (phone) profileUpdate.phone = phone
  if (gender) profileUpdate.gender = gender
  if (Object.keys(profileUpdate).length > 0) {
    await adminClient
      .from('users')
      .update(profileUpdate)
      .eq('id', authData.user.id)
  }

  // Onay maili gönder
  await adminClient.auth.resend({
    type: 'signup',
    email,
  })

  return NextResponse.json({ id: authData.user.id }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  // Admin kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { userId } = await request.json()
  if (!userId) {
    return NextResponse.json({ error: 'userId gerekli' }, { status: 400 })
  }

  // Kendini silmeyi engelle
  if (userId === user.id) {
    return NextResponse.json({ error: 'Kendinizi silemezsiniz' }, { status: 400 })
  }

  // Auth kullanıcısını sil (CASCADE ile tüm veriler silinir)
  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
