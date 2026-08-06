import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import styles from '../css/ProDemandes.module.css'

const STATUTS = ['Toutes', 'En attente', 'En cours', 'Terminée', 'Refusée']

const BADGE_CLASS = {
  'En attente': styles.badgeEnAttente,
  'En cours':   styles.badgeEnCours,
  'Terminée':   styles.badgeTerminee,
  'Refusée':    styles.badgeRefusee,
}

const TOAST_CLASS = {
  accepter: styles.toastSuccess,
  refuser:  styles.toastRefus,
  terminer: styles.toastTermine,
}

const TOAST_MSG = {
  accepter: '✅ Demande acceptée — mission en cours',
  refuser:  '✖ Demande refusée',
  terminer: '🏁 Mission marquée comme terminée',
}

export default function ProDemandes() {
  const [demandes, setDemandes]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [erreur, setErreur]             = useState('')
  const [filtreStatut, setFiltreStatut] = useState('Toutes')
  const [recherche, setRecherche]       = useState('')
  const [toast, setToast]               = useState(null)

  useEffect(() => {
    async function chargerDemandes() {
      setLoading(true)
      setErreur('')
      try {
        const res = await api.get('/demandes')
        setDemandes(res.data.demandes)
      } catch (err) {
        setErreur('Impossible de charger les demandes. Réessayez plus tard.')
      } finally {
        setLoading(false)
      }
    }
    chargerDemandes()
  }, [])

  const demandesAdaptees = useMemo(() => demandes.map(d => ({
    id: d.id,
    initiales: `${d.client?.prenom?.[0] || ''}${d.client?.nom?.[0] || ''}`,
    client: `${d.client?.prenom || ''} ${d.client?.nom || ''}`.trim(),
    type: d.client?.role === 'entreprise' ? 'Entreprise' : 'Particulier',
    ville: d.client?.ville || '',
    specialite: d.objet,
    description: d.message,
    statut: d.statut,
    date: new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  })), [demandes])

  const demandesFiltrees = useMemo(() => {
    return demandesAdaptees.filter(d => {
      const matchStatut = filtreStatut === 'Toutes' || d.statut === filtreStatut
      const q = recherche.toLowerCase()
      const matchRecherche = !q
        || d.client.toLowerCase().includes(q)
        || d.description.toLowerCase().includes(q)
        || d.specialite.toLowerCase().includes(q)
        || d.ville.toLowerCase().includes(q)
      return matchStatut && matchRecherche
    })
  }, [demandesAdaptees, filtreStatut, recherche])

  function countStatut(statut) {
    if (statut === 'Toutes') return demandesAdaptees.length
    return demandesAdaptees.filter(d => d.statut === statut).length
  }

  async function changerStatut(id, nouveauStatut, type) {
    try {
      await api.put(`/demandes/${id}/statut`, { statut: nouveauStatut })
      setDemandes(prev =>
        prev.map(d => d.id === id ? { ...d, statut: nouveauStatut } : d)
      )
      afficherToast(TOAST_MSG[type], TOAST_CLASS[type])
    } catch (err) {
      const message = err.response?.data?.message || 'Une erreur est survenue.'
      afficherToast(`⚠ ${message}`, styles.toastRefus)
    }
  }

  function afficherToast(message, className) {
    setToast({ message, className })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <p style={{ padding: '40px 0', textAlign: 'center' }}>Chargement des demandes…</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Mes demandes reçues</h1>
            <p className={styles.subtitle}>Gérez les demandes de vos clients et suivez l'avancement de vos missions</p>
          </div>
        </div>

        {erreur && (
          <div style={{ color: '#c0392b', marginBottom: 16 }}>{erreur}</div>
        )}

        <div className={styles.filtersBar}>

          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un client, une ville…"
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className={styles.searchInput}
              aria-label="Rechercher dans les demandes"
            />
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Filtrer par statut">
            {STATUTS.map(statut => {
              const isActive = filtreStatut === statut
              const count = countStatut(statut)
              return (
                <button
                  key={statut}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFiltreStatut(statut)}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                >
                  {statut}
                  <span className={`${styles.tabCount} ${!isActive ? styles.tabCountDefault : ''}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p className={styles.resultsCount}>
          {demandesFiltrees.length} demande{demandesFiltrees.length !== 1 ? 's' : ''}
          {filtreStatut !== 'Toutes' ? ` · ${filtreStatut}` : ''}
          {recherche ? ` · "${recherche}"` : ''}
        </p>

        {demandesFiltrees.length > 0 ? (
          <div className={styles.list} role="list">
            {demandesFiltrees.map(d => (
              <article
                key={d.id}
                className={styles.card}
                role="listitem"
                aria-label={`Demande de ${d.client}`}
              >
                <div className={styles.cardLeft}>
                  <div className={styles.avatar}>{d.initiales}</div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTopRow}>
                    <div>
                      <h2 className={styles.clientName}>{d.client}</h2>
                      <p className={styles.clientMeta}>{d.type} · Reçue le {d.date}</p>
                    </div>
                  </div>

                  <p className={styles.description}>{d.description}</p>

                  <div className={styles.cardTags}>
                    <span className={styles.tag}>🔧 {d.specialite}</span>
                    {d.ville && <span className={`${styles.tag} ${styles.tagVille}`}>📍 {d.ville}</span>}
                  </div>
                </div>

                <div className={styles.cardRight}>
                  <span className={`${styles.badge} ${BADGE_CLASS[d.statut]}`}>
                    {d.statut}
                  </span>

                  <div className={styles.actions}>
                    {d.statut === 'En attente' && (
                      <>
                        <button
                          className={styles.btnAccept}
                          onClick={() => changerStatut(d.id, 'En cours', 'accepter')}
                          aria-label={`Accepter la demande de ${d.client}`}
                        >
                          ✓ Accepter
                        </button>
                        <button
                          className={styles.btnRefuse}
                          onClick={() => changerStatut(d.id, 'Refusée', 'refuser')}
                          aria-label={`Refuser la demande de ${d.client}`}
                        >
                          ✕ Refuser
                        </button>
                      </>
                    )}

                    {d.statut === 'En cours' && (
                      <button
                        className={styles.btnTerminer}
                        onClick={() => changerStatut(d.id, 'Terminée', 'terminer')}
                        aria-label={`Marquer la mission de ${d.client} comme terminée`}
                      >
                        🏁 Marquer terminée
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} role="status">
            <div className={styles.emptyIcon}>📭</div>
            <p className={styles.emptyTitle}>Aucune demande trouvée</p>
            <p className={styles.emptyText}>
              {recherche
                ? `Aucun résultat pour "${recherche}" dans les demandes ${filtreStatut !== 'Toutes' ? filtreStatut.toLowerCase() + 's' : ''}`
                : `Vous n'avez pas encore de demandes ${filtreStatut !== 'Toutes' ? filtreStatut.toLowerCase() + 's' : ''}`
              }
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`${styles.toast} ${toast.className}`}
        >
          {toast.message}
        </div>
      )}

      <Footer />
    </div>
  )
}