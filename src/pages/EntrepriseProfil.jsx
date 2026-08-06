import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import styles from '../css/ProProfil.module.css'
import demandesStyles from '../css/ProDemandes.module.css'

const BADGE_CLASS = {
  'En attente': demandesStyles.badgeEnAttente,
  'En cours':   demandesStyles.badgeEnCours,
  'Terminée':   demandesStyles.badgeTerminee,
  'Refusée':    demandesStyles.badgeRefusee,
}

function Stars({ note }) {
  return (
    <span aria-label={`Note : ${note} sur 5`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(note) ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </span>
  )
}

export default function EntrepriseProfil() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur]   = useState(false)

  useEffect(() => {
    async function charger() {
      setLoading(true)
      setErreur(false)
      try {
        const res = await api.get(`/entreprises/${id}`)
        setData(res.data)
      } catch (err) {
        setErreur(true)
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <p style={{ padding: '40px 0', textAlign: 'center' }}>Chargement de la fiche…</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (erreur || !data) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>🏢</div>
            <p className={styles.notFoundTitle}>Entreprise introuvable</p>
            <button className={styles.notFoundBtn} onClick={() => navigate('/entreprises')}>
              Retour à la liste
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const { entreprise, demandes, avis } = data
  const nom = `${entreprise.prenom} ${entreprise.nom}`.trim()

  const demandesParStatut = {
    'En attente': demandes.filter(d => d.statut === 'En attente'),
    'En cours':   demandes.filter(d => d.statut === 'En cours'),
    'Terminée':   demandes.filter(d => d.statut === 'Terminée'),
    'Refusée':    demandes.filter(d => d.statut === 'Refusée'),
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

        <Link to="/entreprises" className={styles.backLink}>
          ← Retour aux entreprises
        </Link>

        <div className={styles.layout}>

          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>{entreprise.prenom?.[0] || '🏢'}</div>
              <h1 className={styles.proName}>{nom}</h1>
              <p className={styles.proSpec}>Entreprise partenaire</p>

              <ul className={styles.metaList}>
                <li className={styles.metaItem}>
                  <span className={styles.metaIcon}>📍</span>
                  {entreprise.ville || 'Ville non renseignée'}
                </li>
                <li className={styles.metaItem}>
                  <span className={styles.metaIcon}>📋</span>
                  {demandes.length} demande{demandes.length !== 1 ? 's' : ''} envoyée{demandes.length !== 1 ? 's' : ''}
                </li>
                <li className={styles.metaItem}>
                  <span className={styles.metaIcon}>⭐</span>
                  {avis.length} avis laissé{avis.length !== 1 ? 's' : ''}
                </li>
              </ul>
            </div>
          </aside>

          <main className={styles.main}>

            <section className={styles.card} aria-labelledby="demandes-title">
              <h2 id="demandes-title" className={styles.cardTitle}>
                Demandes ({demandes.length})
              </h2>

              {demandes.length > 0 ? (
                <div className={demandesStyles.list} style={{ marginTop: 16 }}>
                  {demandes.map(d => {
                    const proNom = `${d.professionnel?.user?.prenom || ''} ${d.professionnel?.user?.nom || ''}`.trim()
                    return (
                      <article key={d.id} className={demandesStyles.card}>
                        <div className={demandesStyles.cardBody}>
                          <div className={demandesStyles.cardTopRow}>
                            <div>
                              <h3 className={demandesStyles.clientName}>
                                Vers {proNom || 'Professionnel'}
                              </h3>
                              <p className={demandesStyles.clientMeta}>
                                {new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <p className={demandesStyles.description}>{d.message}</p>
                          <div className={demandesStyles.cardTags}>
                            <span className={demandesStyles.tag}>📌 {d.objet}</span>
                          </div>
                        </div>
                        <div className={demandesStyles.cardRight}>
                          <span className={`${demandesStyles.badge} ${BADGE_CLASS[d.statut]}`}>
                            {d.statut}
                          </span>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <p style={{ color: '#9A8FBD', fontSize: 13 }}>Aucune demande envoyée pour le moment.</p>
              )}
            </section>

            <section className={styles.card} aria-labelledby="avis-title">
              <h2 id="avis-title" className={styles.cardTitle}>
                Avis laissés ({avis.length})
              </h2>

              {avis.length > 0 ? (
                <div className={styles.avisList}>
                  {avis.map(a => {
                    const proNom = `${a.professionnel?.user?.prenom || ''} ${a.professionnel?.user?.nom || ''}`.trim()
                    return (
                      <div key={a.id} className={styles.avisCard}>
                        <div className={styles.avisHeader}>
                          <div className={styles.avisAuteur}>
                            <div>
                              <p className={styles.avisNom}>Pour {proNom || 'Professionnel'}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Stars note={a.note} />
                            <span className={styles.avisDate}>
                              {new Date(a.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <p className={styles.avisTexte}>"{a.texte}"</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p style={{ color: '#9A8FBD', fontSize: 13 }}>Aucun avis laissé pour le moment.</p>
              )}
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}