import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  // Verifica que quem chama está autenticado
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  // Lê os dados enviados pelo browser
  const sub = await request.json()

  // Marca a submissão como aprovada
  const { error: updateError } = await supabaseAdmin
    .from('price_submissions')
    .update({ moderation_status: 'approved' })
    .eq('id', sub.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Atualiza o preço atual
  const { error: upsertError } = await supabaseAdmin
    .from('price_current')
    .upsert({
      venue_id: sub.venue_id,
      poncha_type_id: sub.poncha_type_id,
      submission_id: sub.id,
      price_eur: sub.price_eur,
      verified_at: new Date().toISOString(),
    })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}