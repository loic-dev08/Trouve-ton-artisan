// src/components/ProCard.jsx
import { useNavigate } from 'react-router-dom'

function Stars({ note }) {
  return (
    <span aria-label={`Note : ${note} sur 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(note) ? '#BA7517' : '#3a3a3a', fontSize: '14px' }}>
          ★
        </span>
      ))}
    </span>
  )
}

export default function ProCard({ id, nom, specialite, ville, note, avis, initiales, dispo }) {
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/pro/${id}`)}
      role="button"
      tabIndex={0}
      aria-label={`Voir le profil de ${nom}`}
      onKeyDown={e => e.key === 'Enter' && navigate(`/pro/${id}`)}
      style={{
        background: '#0D1F35',
        border: '1px solid rgba(24,95,165,0.25)',
        borderRadius: 14,
        padding: '20px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'transform .15s, border-color .15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = 'rgba(127,119,221,0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = 'rgba(24,95,165,0.25)'
      }}
    >
      {/* Avatar + dispo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #185FA5, #7F77DD)',
          color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 700, fontSize: 14,
        }}>
          {initiales}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 20,
          background: dispo ? 'rgba(29,158,117,0.15)' : 'rgba(100,100,100,0.15)',
          color: dispo ? '#1D9E75' : '#888',
        }}>
          {dispo ? '● Disponible' : '○ Occupé'}
        </span>
      </div>

      {/* Infos */}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#E6EDF3', margin: 0 }}>{nom}</h3>
      <p  style={{ fontSize: 12, color: '#8B949E', margin: 0, lineHeight: 1.4 }}>{specialite}</p>
      <p  style={{ fontSize: 12, color: '#556070', margin: 0 }}>📍 {ville}</p>

      {/* Note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <Stars note={note} />
        <span style={{ fontSize: 11, color: '#8B949E' }}>{note}/5 · {avis} avis</span>
      </div>
    </article>
  )
}