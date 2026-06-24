import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const sub = await request.json()

  const { error } = await supabaseAdmin
    .from('price_submissions')
    .update({ moderation_status: 'rejected' })
    .eq('id', sub.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}