import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('member_goals')
    .select('*')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { metric_type, target_value } = await req.json()

  if (!metric_type || target_value == null) {
    return NextResponse.json({ error: 'metric_type and target_value required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('member_goals')
    .upsert(
      { user_id: user.id, metric_type, target_value, achieved_at: null },
      { onConflict: 'user_id,metric_type' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { metric_type } = await req.json()

  const { error } = await supabase
    .from('member_goals')
    .delete()
    .eq('user_id', user.id)
    .eq('metric_type', metric_type)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
