import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { NextResponse } from 'next/server'

async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  return user
}

// criar venue
export async function POST(request) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'Not authorized' }, { status: 401 })

  const body = await request.json()
  const { name, slug, address, municipality, latitude, longitude, phone, website } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('venues')
    .insert({
      name,
      slug,
      address: address || null,
      municipality: municipality || null,
      latitude: latitude || null,
      longitude: longitude || null,
      phone: phone || null,
      website: website || null,
      status: 'active',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ venue: data })
}

// editar venue
export async function PUT(request) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'Not authorized' }, { status: 401 })

  const body = await request.json()
  const { id, name, slug, address, municipality, latitude, longitude, phone, website, status } = body

  if (!id) return NextResponse.json({ error: 'Venue ID is required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('venues')
    .update({
      name,
      slug,
      address: address || null,
      municipality: municipality || null,
      latitude: latitude || null,
      longitude: longitude || null,
      phone: phone || null,
      website: website || null,
      status: status || 'active',
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ venue: data })
}