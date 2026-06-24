'use client'

import dynamic from 'next/dynamic'

const VenuesMapView = dynamic(() => import('./VenuesMapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-800/40">
      Loading map...
    </div>
  ),
})

export default function VenuesMap({ venues }) {
  if (!venues || venues.length === 0) return null
  return <VenuesMapView venues={venues} />
}