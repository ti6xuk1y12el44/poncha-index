import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('price_submissions')
    .select('*, venues(name), poncha_types(name)')
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ submissions: data })
}