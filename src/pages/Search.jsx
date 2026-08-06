import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchBar from '../components/SearchBar'
import api from '../services/api'
import styles from '../css/Recherche.module.css'



const SPECIALITES = [
  'Toutes les spécialités',
  'Réseau & Cybersécurité',
  'Administration Systèmes',
  'Développement React/Node',
  'Développement Web',
  'Développement Mobile',
  'UX Design & Intégration',
  'Data Science & IA',
  'Cloud & DevOps',
  'Support & Dépannage',
]

const VILLES = [
  'Toutes les villes',
  'Melun',
  'Montereau',
  'Sens',
  'Auxerre',
  'Montpellier',
  'Paris',
]

const NOTES_MIN = [
  { label: 'Toutes les notes', value: 0 },
  { label: '⭐ 3 et plus',    value: 3 },
  { label: '⭐ 4 et plus',    value: 4 },
  { label: '⭐ 4.5 et plus',  value: 4.5 },
]

// ── Composant étoiles ─────────────────────────────────────────
function Stars({ note }) {
  return (
    <span aria-label={`Note : ${note} sur 5`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(note) ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </span>
  )
}

export default function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [specialiteSearch, setSpecialiteSearch] = useState(searchParams.get('specialite') || '')
  const [villeSearch, setVilleSearch]           = useState(searchParams.get('ville') || '')

  const [filtreSpecialite, setFiltreSpecialite] = useState('Toutes les spécialités')
  const [filtreVille, setFiltreVille]           = useState('Toutes les villes')
  const [filtreDispo, setFiltreDispo]           = useState('tous')
  const [filtreNote, setFiltreNote]             = useState(0)

  const [vue, setVue]         = useState('grille')
  const [pros, setPros]       = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur]   = useState('')

  // ── Appel API à chaque changement de filtre ──
  useEffect(() => {
    async function chargerProfessionnels() {
      setLoading(true)
      setErreur('')
      try {
        const params = {}

        // Priorité aux filtres avancés, sinon recherche texte de la SearchBar
        const specialiteFinale = filtreSpecialite !== 'Toutes les spécialités'
          ? filtreSpecialite
          : specialiteSearch
        const villeFinale = filtreVille !== 'Toutes les villes'
          ? filtreVille
          : villeSearch

        if (specialiteFinale) params.specialite = specialiteFinale
        if (villeFinale)      params.ville = villeFinale
        if (filtreDispo !== 'tous') params.dispo = filtreDispo === 'dispo'
        if (filtreNote > 0)   params.noteMin = filtreNote

        const res = await api.get('/professionnels', { params })
        setPros(res.data.professionnels)
      } catch (err) {
        setErreur('Impossible de charger les professionnels. Réessayez plus tard.')
      } finally {
        setLoading(false)
      }
    }

    chargerProfessionnels()
  }, [specialiteSearch, villeSearch, filtreSpecialite, filtreVille, filtreDispo, filtreNote])

  function resetFiltres() {
    setFiltreSpecialite('Toutes les spécialités')
    setFiltreVille('Toutes les villes')
    setFiltreDispo('tous')
    setFiltreNote(0)
    setSpecialiteSearch('')
    setVilleSearch('')
    setSearchParams({})
  }

  function handleSearch({ specialite, ville }) {
    setSpecialiteSearch(specialite)
    setVilleSearch(ville)
    const params = {}
    if (specialite) params.specialite = specialite
    if (ville)      params.ville = ville
    setSearchParams(params)
  }

  const aFiltresActifs = filtreSpecialite !== 'Toutes les spécialités'
    || filtreVille !== 'Toutes les villes'
    || filtreDispo !== 'tous'
    || filtreNote > 0
    || specialiteSearch
    || villeSearch

  // Adapte la structure des données API au format attendu par le JSX
  const prosFiltres = pros.map(p => ({
    id: p.id,
    nom: `${p.user?.prenom || ''} ${p.user?.nom || ''}`.trim(),
    initiales: `${p.user?.prenom?.[0] || ''}${p.user?.nom?.[0] || ''}`,
    specialite: p.specialite,
    ville: p.ville,
    note: p.note_moyenne ? parseFloat(p.note_moyenne) : 0,
    avis: p.nombre_avis,
    dispo: p.disponible,
  }))

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

        <div className={styles.headerRow}>
          <h1 className={styles.title}>Rechercher un professionnel IT</h1>
          <p className={styles.subtitle}>Trouvez l'expert qu'il vous faut parmi nos professionnels vérifiés</p>
        </div>

        <div className={styles.searchBarWrapper}>
          <SearchBar
            initialSpecialite={specialiteSearch}
            initialVille={villeSearch}
            onSearch={handleSearch}
          />
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Spécialité</label>
            <select
              className={styles.filterSelect}
              value={filtreSpecialite}
              onChange={e => setFiltreSpecialite(e.target.value)}
              aria-label="Filtrer par spécialité"
            >
              {SPECIALITES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Ville</label>
            <select
              className={styles.filterSelect}
              value={filtreVille}
              onChange={e => setFiltreVille(e.target.value)}
              aria-label="Filtrer par ville"
            >
              {VILLES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Disponibilité</label>
            <select
              className={styles.filterSelect}
              value={filtreDispo}
              onChange={e => setFiltreDispo(e.target.value)}
              aria-label="Filtrer par disponibilité"
            >
              <option value="tous">Tous</option>
              <option value="dispo">Disponible uniquement</option>
              <option value="occupe">Occupé uniquement</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Note minimale</label>
            <select
              className={styles.filterSelect}
              value={filtreNote}
              onChange={e => setFiltreNote(Number(e.target.value))}
              aria-label="Filtrer par note minimale"
            >
              {NOTES_MIN.map(n => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>

          {aFiltresActifs && (
            <button className={styles.resetFiltersBtn} onClick={resetFiltres}>
              ↺ Réinitialiser
            </button>
          )}
        </div>

        <div className={styles.resultsBar}>
          <p className={styles.resultsCount}>
            <strong>{prosFiltres.length}</strong> professionnel{prosFiltres.length !== 1 ? 's' : ''} trouvé{prosFiltres.length !== 1 ? 's' : ''}
          </p>
          <div className={styles.viewToggle} role="group" aria-label="Changer la vue">
            <button
              className={`${styles.viewBtn} ${vue === 'grille' ? styles.viewBtnActive : ''}`}
              onClick={() => setVue('grille')}
              aria-label="Vue grille"
              aria-pressed={vue === 'grille'}
              title="Vue grille"
            >⊞</button>
            <button
              className={`${styles.viewBtn} ${vue === 'liste' ? styles.viewBtnActive : ''}`}
              onClick={() => setVue('liste')}
              aria-label="Vue liste"
              aria-pressed={vue === 'liste'}
              title="Vue liste"
            >☰</button>
          </div>
        </div>

        {loading ? (
          <p className={styles.emptyText}>Chargement des professionnels…</p>
        ) : erreur ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{erreur}</p>
          </div>
        ) : prosFiltres.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyTitle}>Aucun professionnel trouvé</p>
            <p className={styles.emptyText}>
              Essayez d'élargir vos critères de recherche ou de modifier les filtres.
            </p>
            <button className={styles.emptyBtn} onClick={resetFiltres}>
              Effacer tous les filtres
            </button>
          </div>
        ) : vue === 'grille' ? (
          <div className={styles.grid}>
            {prosFiltres.map(pro => (
              <article
                key={pro.id}
                className={styles.proCard}
                onClick={() => navigate(`/pro/${pro.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`Voir le profil de ${pro.nom}`}
                onKeyDown={e => e.key === 'Enter' && navigate(`/pro/${pro.id}`)}
              >
                <div className={styles.proCardTop}>
                  <div className={styles.avatar}>{pro.initiales}</div>
                  <span className={`${styles.dispoBadge} ${pro.dispo ? styles.dispoOn : styles.dispoOff}`}>
                    {pro.dispo ? '● Disponible' : '○ Occupé'}
                  </span>
                </div>

                <div>
                  <h2 className={styles.proName}>{pro.nom}</h2>
                  <p className={styles.proSpec}>{pro.specialite}</p>
                  <p className={styles.proVille}>📍 {pro.ville}</p>
                </div>

                <div className={styles.proFooter}>
                  <div>
                    <Stars note={pro.note} />
                    <span className={styles.proNote}> {pro.note}/5</span>
                  </div>
                  <span className={styles.proAvis}>{pro.avis} avis</span>
                </div>

                <button
                  className={styles.contactBtn}
                  onClick={e => { e.stopPropagation(); navigate(`/pro/${pro.id}`) }}
                >
                  Voir le profil
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.list}>
            {prosFiltres.map(pro => (
              <article
                key={pro.id}
                className={styles.proRow}
                onClick={() => navigate(`/pro/${pro.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`Voir le profil de ${pro.nom}`}
                onKeyDown={e => e.key === 'Enter' && navigate(`/pro/${pro.id}`)}
              >
                <div className={styles.avatar}>{pro.initiales}</div>

                <div className={styles.proRowBody}>
                  <div>
                    <p className={styles.proRowName}>{pro.nom}</p>
                    <p className={styles.proRowSpec}>{pro.specialite} · 📍 {pro.ville}</p>
                  </div>

                  <div className={styles.proRowMeta}>
                    <span className={styles.proRowNote}>
                      <Stars note={pro.note} /> {pro.note}/5
                    </span>
                    <span className={styles.proRowAvis}>{pro.avis} avis</span>
                  </div>

                  <div className={styles.proRowMeta}>
                    <span className={`${styles.dispoBadge} ${pro.dispo ? styles.dispoOn : styles.dispoOff}`}>
                      {pro.dispo ? '● Disponible' : '○ Occupé'}
                    </span>
                  </div>
                </div>

                <div className={styles.proRowActions}>
                  <button
                    className={styles.contactBtnSm}
                    onClick={e => { e.stopPropagation(); navigate(`/pro/${pro.id}`) }}
                  >
                    Voir le profil →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}
