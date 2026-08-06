import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
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

export default function MesDemandes() {
  const [demandes, setDemandes]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [erreur, setErreur]             = useState('')
  const [filtreStatut, setFiltreStatut] = useState('Toutes')
  const [recherche, setRecherche]       = useState('')

  useEffect(() => {
    async function chargerDemandes() {
      setLoading(true)
      setErreur('')
      try {
        const res = await api.get('/demandes')
        setDemandes(res.data.demandes)
      } catch (err) {
        setErreur('Impossible de charger vos demandes. Réessayez plus tard.')
      } finally {
        setLoading(false)
      }
    }
    chargerDemandes()
  }, [])

  const demandesAdaptees = useMemo(() => demandes.map(d => {
    const proUser = d.professionnel?.user
    return {
      id: d.id,
      proId: d.professionnel?.id,
      initiales: `${proUser?.prenom?.[0] || ''}${proUser?.nom?.[0] || ''}`,
      proNom: `${proUser?.prenom || ''} ${proUser?.nom || ''}`.trim(),
      specialite: d.professionnel?.specialite || '',
      objet: d.objet,
      description: d.message,
      statut: d.statut,
      date: new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
  }), [demandes])

  const demandesFiltrees = useMemo(() => {
    return demandesAdaptees.filter(d => {
      const matchStatut = filtreStatut === 'Toutes' || d.statut === filtreStatut
      const q = recherche.toLowerCase()
      const matchRecherche = !q
        || d.proNom.toLowerCase().includes(q)
        || d.description.toLowerCase().includes(q)
        || d.objet.toLowerCase().includes(q)
        || d.specialite.toLowerCase().includes(q)
      return matchStatut && matchRecherche
    })
  }, [demandesAdaptees, filtreStatut, recherche])

  function countStatut(statut) {
    if (statut === 'Toutes') return demandesAdaptees.length
    return demandesAdaptees.filter(d => d.statut === statut).length
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <p style={{ padding: '40px 0', textAlign: 'center' }}>Chargement de vos demandes…</p>
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
            <h1 className={styles.title}>Mes demandes envoyées</h1>
            <p className={styles.subtitle}>Suivez l'avancement de vos demandes auprès des professionnels</p>
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
              placeholder="Rechercher un professionnel, un objet…"
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className={styles.searchInput}
              aria-label="Rechercher dans mes demandes"
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
                aria-label={`Demande envoyée à ${d.proNom}`}
              >
                <div className={styles.cardLeft}>
                  <div className={styles.avatar}>{d.initiales}</div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTopRow}>
                    <div>
                      <h2 className={styles.clientName}>
                        {d.proId ? (
                          <Link to={`/pro/${d.proId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {d.proNom}
                          </Link>
                        ) : d.proNom}
                      </h2>
                      <p className={styles.clientMeta}>{d.specialite} · Envoyée le {d.date}</p>
                    </div>
                  </div>

                  <p className={styles.description}>{d.description}</p>

                  <div className={styles.cardTags}>
                    <span className={styles.tag}>📌 {d.objet}</span>
                  </div>
                </div>

                <div className={styles.cardRight}>
                  <span className={`${styles.badge} ${BADGE_CLASS[d.statut]}`}>
                    {d.statut}
                  </span>
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
                ? `Aucun résultat pour "${recherche}"`
                : "Vous n'avez pas encore envoyé de demande à un professionnel."
              }
            </p>
            <Link to="/recherche" className={styles.emptyBtn}>
              Trouver un professionnel
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}