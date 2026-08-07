import { useState } from 'react'

// ── StarRating ──────────────────────────────────────────────
// Props :
//   note     (number)   — note actuelle (lecture ou écriture)
//   onChange (function) — si fourni, active le mode écriture
//   size     (number)   — taille des étoiles en px (défaut 20)
//   showLabel(bool)     — affiche "X / 5" à côté (défaut false)
// ───────────────────────────────────────────────────────────
export default function StarRating({
  note = 0,
  onChange = null,
  size = 20,
  showLabel = false,
}) {
  const [hovered, setHovered] = useState(null)
  const modeEcriture = typeof onChange === 'function'
  const affichee = hovered !== null ? hovered : note

  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
      role={modeEcriture ? 'group' : 'img'}
      aria-label={`Note : ${note} sur 5`}
    >
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => modeEcriture && onChange(i)}
          onMouseEnter={() => modeEcriture && setHovered(i)}
          onMouseLeave={() => modeEcriture && setHovered(null)}
          onKeyDown={e => modeEcriture && e.key === 'Enter' && onChange(i)}
          tabIndex={modeEcriture ? 0 : -1}
          role={modeEcriture ? 'button' : undefined}
          aria-label={modeEcriture ? `Donner ${i} étoile${i > 1 ? 's' : ''}` : undefined}
          style={{
            fontSize: size,
            lineHeight: 1,
            color: i <= Math.round(affichee) ? '#BA7517' : '#2E3440',
            cursor: modeEcriture ? 'pointer' : 'default',
            transition: 'color .1s, transform .1s',
            transform: modeEcriture && hovered >= i ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}

      {showLabel && (
        <span style={{
          fontSize: size * 0.6,
          color: '#8B949E',
          marginLeft: 6,
          fontFamily: 'system-ui, sans-serif',
        }}>
          {note} / 5
        </span>
      )}
    </span>
  )
}
