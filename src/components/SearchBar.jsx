import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../css/SearchBar.module.css'

// ── SearchBar ────────────────────────────────────────────────
// Props :
//   initialSpecialite (string) — valeur pré-remplie spécialité
//   initialVille      (string) — valeur pré-remplie ville
//   onSearch (function)        — callback optionnel (si utilisé
//                                dans Search.jsx pour filtrer
//                                sans navigation)
//   compact  (bool)            — version compacte pour header
// ────────────────────────────────────────────────────────────
export default function SearchBar({
  initialSpecialite = '',
  initialVille = '',
  onSearch = null,
  compact = false,
}) {
  const [specialite, setSpecialite] = useState(initialSpecialite)
  const [ville, setVille]           = useState(initialVille)
  const [focused, setFocused]       = useState(null)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (onSearch) {
      // Mode filtrage local (page Search)
      onSearch({ specialite, ville })
    } else {
      // Mode navigation (Home → Search)
      const params = new URLSearchParams()
      if (specialite.trim()) params.set('specialite', specialite.trim())
      if (ville.trim())      params.set('ville', ville.trim())
      navigate(`/recherche?${params.toString()}`)
    }
  }

  function handleReset() {
    setSpecialite('')
    setVille('')
    if (onSearch) onSearch({ specialite: '', ville: '' })
  }

  const hasValue = specialite.trim() || ville.trim()

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? styles.formCompact : styles.form}
      role="search"
      aria-label="Rechercher un artisan"
    >
      {/* ── Champ spécialité ── */}
      <div
        className={[
          styles.field,
          compact ? styles.fieldCompact : '',
          focused === 'specialite' ? styles.fieldFocused : '',
        ].filter(Boolean).join(' ')}
      >
        <span className={styles.icon} aria-hidden="true">💻</span>
        <input
          type="text"
          placeholder={compact ? 'Spécialité…' : 'Spécialité (ex : plomberie, chauffagiste, fleuriste…)'}
          value={specialite}
          onChange={e => setSpecialite(e.target.value)}
          onFocus={() => setFocused('specialite')}
          onBlur={() => setFocused(null)}
          className={styles.input}
          aria-label="Spécialité recherchée"
          autoComplete="off"
        />
        {specialite && (
          <button
            type="button"
            onClick={() => setSpecialite('')}
            className={styles.clearBtn}
            aria-label="Effacer la spécialité"
          >×</button>
        )}
      </div>

      {/* ── Séparateur ── */}
      <div className={styles.separator} aria-hidden="true" />

      {/* ── Champ ville ── */}
      <div
        className={[
          styles.field,
          styles.fieldVille,
          compact ? styles.fieldVilleCompact : '',
          focused === 'ville' ? styles.fieldFocused : '',
        ].filter(Boolean).join(' ')}
      >
        <span className={styles.icon} aria-hidden="true">📍</span>
        <input
          type="text"
          placeholder={compact ? 'Ville…' : 'Ville (ex : Lyon, Evian, Chambéry…)'}
          value={ville}
          onChange={e => setVille(e.target.value)}
          onFocus={() => setFocused('ville')}
          onBlur={() => setFocused(null)}
          className={styles.input}
          aria-label="Ville"
          autoComplete="off"
        />
        {ville && (
          <button
            type="button"
            onClick={() => setVille('')}
            className={styles.clearBtn}
            aria-label="Effacer la ville"
          >×</button>
        )}
      </div>

      {/* ── Boutons ── */}
      <div className={styles.btnRow}>
        {hasValue && !compact && (
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetBtn}
            aria-label="Réinitialiser la recherche"
          >
            ↺
          </button>
        )}
        <button
          type="submit"
          className={compact ? styles.submitBtnCompact : styles.submitBtn}
          aria-label="Lancer la recherche"
        >
          {compact ? '🔍' : '🔍 Rechercher'}
        </button>
      </div>
    </form>
  )
}
