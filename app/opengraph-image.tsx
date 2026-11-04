import { ImageResponse } from 'next/og'

export const alt = 'AWWALSHOP — Elegance in Every Detail'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#241C19',
          color: '#F8F5EF',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '48px', height: '2px', background: '#C5A46D' }} />
          <span
            style={{
              fontSize: '20px',
              letterSpacing: '8px',
              color: '#C5A46D',
              textTransform: 'uppercase',
            }}
          >
            Modern African Luxury
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '104px', fontWeight: 600, letterSpacing: '-2px' }}>
            AWWALSHOP
          </span>
          <span style={{ fontSize: '40px', color: '#E8DED0', marginTop: '10px' }}>
            Elegance in Every Detail.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '36px', fontSize: '20px', color: '#8B8178' }}>
          <span>Fine Jewellery</span>
          <span>Timepieces</span>
          <span>Traditional Attire</span>
          <span>Leather Goods</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
