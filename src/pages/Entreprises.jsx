import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import styles from '../css/Recherche.module.css'

export default function Entreprises() {
  const navigate = useNavigate()
  const [entreprises, setEntreprises] = useState([])
  const [loading, setLoading]         = useState(true)
  const [erreur, setErreur]           = useState('')
  const [ville, setVille]             = useState('')

  useEffect(() => {
    async function charger() {
      setLoading(true)
      setErreur('')
      try {
        const params = {}
        if (ville) params.ville = ville
        const res = await api.get('/entreprises', { params })
        setEntreprises(res.data.entreprises)
      } catch (err) {
        setErreur('Impossible de charger les entreprises. Réessayez plus tard.')
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [ville])

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

        <div className={styles.headerRow}>
          <h1 className={styles.title}>Entreprises partenaires</h1>
          <p className={styles.subtitle}>Découvrez les entreprises qui font confiance à ITConnect</p>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Ville</label>
            <input
              type="text"
              value={ville}
              onChange={e => setVille(e.target.value)}
              placeholder="Filtrer par ville…"
              className={styles.filterSelect}
              aria-label="Filtrer par ville"
            />
          </div>
        </div>

        {loading ? (
          <p className={styles.emptyText}>Chargement des entreprises…</p>
        ) : erreur ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{erreur}</p>
          </div>
        ) : entreprises.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏢</div>
            <p className={styles.emptyTitle}>Aucune entreprise trouvée</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {entreprises.map(e => (
              <article
  key={e.id}
  className={styles.proCard}
  onClick={() => navigate(`/entreprise/${e.id}`)}
  role="button"
  tabIndex={0}
  aria-label={`Voir la fiche de ${e.prenom} ${e.nom}`}
  onKeyDown={ev => ev.key === 'Enter' && navigate(`/entreprise/${e.id}`)}
>
  <div className={styles.proCardTop}>
    <div className={styles.avatar}>{e.prenom?.[0] || '🏢'}</div>
    <span className={`${styles.dispoBadge} ${styles.dispoOn}`}>
      🏢 Entreprise
    </span>
  </div>

  <div>
    <h2 className={styles.proName}>{e.prenom} {e.nom}</h2>
    <p className={styles.proSpec}>Entreprise partenaire</p>
    <p className={styles.proVille}>📍 {e.ville || 'Ville non renseignée'}</p>
  </div>

  <div className={styles.proFooter}>
    <span className={styles.proNote}>
      {e.nombre_demandes} demande{e.nombre_demandes !== 1 ? 's' : ''}
    </span>
    <span className={styles.proAvis}>
      {e.nombre_avis} avis laissé{e.nombre_avis !== 1 ? 's' : ''}
    </span>
  </div>

  <button
    className={styles.contactBtn}
    onClick={ev => { ev.stopPropagation(); navigate(`/entreprise/${e.id}`) }}
  >
    Voir la fiche
  </button>
</article>
            ))}
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}
