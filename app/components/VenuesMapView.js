'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Cor do pin conforme o preço: verde (barato) → amarelo → vermelho (caro)
function priceColor(price, min, max) {
  if (max === min) return '#059669' // tudo igual = verde
  const ratio = (price - min) / (max - min)
  if (ratio < 0.33) return '#059669'  // emerald
  if (ratio < 0.66) return '#d97706'  // amber
  return '#e11d48'                     // rose
}

export default function VenuesMapView({ venues }) {
  // Só venues com coordenadas e com preço
  const withCoords = venues.filter(v => v.latitude && v.longitude)

  const prices = withCoords.filter(v => v.price != null).map(v => v.price)
  const min = prices.length ? Math.min(...prices) : 0
  const max = prices.length ? Math.max(...prices) : 0

  // Centro do mapa: Madeira
  const center = [32.7607, -16.9595]

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: '500px', width: '100%', borderRadius: '1.5rem' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map(v => (
        <CircleMarker
          key={v.id}
          center={[v.latitude, v.longitude]}
          radius={14}
          pathOptions={{
            fillColor: v.price != null ? priceColor(v.price, min, max) : '#9ca3af',
            fillOpacity: 0.9,
            color: 'white',
            weight: 2,
          }}
        >
          <Popup>
            <strong>{v.name}</strong><br/>
            {v.municipality}<br/>
            {v.price != null ? '€' + v.price.toFixed(2) : 'No price yet'}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}