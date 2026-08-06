import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from '../css/Dashboard.module.css'

const FAKE_USER = {
  prenom: 'Camille',
  nom: 'Dubois',
  role: 'professionnel',
}

const ROLE_LABELS = {
  particulier: 'Particulier',
  entreprise: 'Entreprise',
  professionnel: 'Professionnel IT',
  admin: 'Administrateur',
}

const STATS_BY_ROLE = {
  particulier: [
    { label: 'Demandes envoyées', value: 5, trend: '+2 ce mois', up: true },
    { label: 'Demandes en cours', value: 1, trend: null, up: null },
    { label: 'Pros contactés', value: 3, trend: null, up: null },
    { label: 'Avis laissés', value: 2, trend: null, up: null },
  ],
  entreprise: [
    { label: 'Prestataires actifs', value: 4, trend: '+1 ce mois', up: true },
    { label: 'Demandes en cours', value: 2, trend: null, up: null },
    { label: 'Budget engagé', value: '3 200 €', trend: null, up: null },
    { label: 'Avis laissés', value: 6, trend: null, up: null },
  ],
  professionnel: [
    { label: 'Demandes reçues', value: 12, trend: '+4 cette semaine', up: true },
    { label: 'Missions en cours', value: 3, trend: null, up: null },
    { label: 'Note moyenne', value: '4.8/5', trend: null, up: null },
    { label: 'Avis reçus', value: 24, trend: '+2 ce mois', up: true },
  ],
  admin: [
    { label: 'Utilisateurs', value: 248, trend: '+18 ce mois', up: true },
    { label: 'Professionnels', value: 64, trend: null, up: null },
    { label: 'Demandes actives', value: 37, trend: null, up: null },
    { label: 'Signalements', value: 2, trend: '-1', up: false },
  ],
}

const ACTIVITY_BY_ROLE = {
  particulier: [
    { id: 1, icon: '💻', color: 'blue',   titre: 'Demande envoyée à Larry Max', meta: 'Expert réseau & cybersécurité · il y a 2h',   statut: 'En attente' },
    { id: 2, icon: '✅', color: 'teal',   titre: 'Mission terminée avec Lucie Perrin', meta: 'Administratrice systèmes · il y a 3 jours', statut: 'Terminé' },
    { id: 3, icon: '💬', color: 'purple', titre: 'Nouveau message de Amélie Chevalier', meta: 'Développeuse React/Node.js · il y a 5 jours', statut: 'En cours' },
  ],
  entreprise: [
    { id: 1, icon: '📋', color: 'blue',   titre: 'Nouvelle demande de maintenance', meta: 'Parc informatique · il y a 1h',          statut: 'En attente' },
    { id: 2, icon: '✅', color: 'teal',   titre: 'Intervention terminée — Lucie Perrin', meta: 'Administration systèmes · hier',     statut: 'Terminé' },
    { id: 3, icon: '📄', color: 'purple', titre: 'Devis reçu pour refonte du site', meta: 'Amélie Chevalier · il y a 4 jours',       statut: 'En cours' },
  ],
  professionnel: [
    { id: 1, icon: '📩', color: 'blue',   titre: 'Nouvelle demande — Sécurisation réseau', meta: 'Particulier · Melun · il y a 1h',   statut: 'En attente' },
    { id: 2, icon: '✅', color: 'teal',   titre: 'Mission terminée — Configuration serveur', meta: 'DataSolutions SAS · hier',        statut: 'Terminé' },
    { id: 3, icon: '⭐', color: 'purple', titre: 'Nouvel avis reçu — 5/5', meta: 'Claire Girard · il y a 2 jours',                    statut: 'Terminé' },
    { id: 4, icon: '📩', color: 'blue',   titre: 'Nouvelle demande — Audit cybersécurité', meta: 'Entreprise · Sens · il y a 3 jours', statut: 'En attente' },
  ],
  admin: [
    { id: 1, icon: '👤', color: 'blue',   titre: 'Nouveau professionnel inscrit', meta: 'Romain Bernard · il y a 30 min',          statut: 'En attente' },
    { id: 2, icon: '🚩', color: 'purple', titre: 'Signalement utilisateur', meta: 'Profil #1042 · il y a 2h',                       statut: 'En cours' },
    { id: 3, icon: '✅', color: 'teal',   titre: 'Vérification profil validée', meta: 'Nina Vallet · il y a 1 jour',                statut: 'Terminé' },
  ],
}

function getNavItems(role) {
  const demandesPath = role === 'professionnel' ? '/dashboard/demandes' : '/dashboard/mes-demandes'
  return [
    { id: 'apercu',     label: 'Aperçu',      icon: '📊' },
    { id: 'demandes',   label: role === 'professionnel' ? 'Demandes reçues' : 'Mes demandes', icon: '📋', path: demandesPath },
    { id: 'messages',   label: 'Messages',    icon: '💬' },
    { id: 'profil',     label: 'Mon profil',  icon: '👤', path: '/dashboard/profil' },
    { id: 'avis',       label: 'Avis',        icon: '⭐' },
    { id: 'parametres', label: 'Paramètres',  icon: '⚙️' },
  ]
}

function StatusBadge({ statut }) {
  const map = {
    'En attente': styles.statusEnAttente,
    'En cours':   styles.statusEnCours,
    'Terminé':    styles.statusTermine,
  }
  return <span className={`${styles.activityStatus} ${map[statut] || ''}`}>{statut}</span>
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('apercu')
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function chargerProfil() {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/connexion')
        return
      }

      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      } catch (err) {
        // Token invalide ou expiré → déconnexion et retour à la page de connexion
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/connexion')
      } finally {
        setLoading(false)
      }
    }

    chargerProfil()
  }, [navigate])

  if (loading) {
    return <div className={styles.page}>Chargement…</div>
  }

  if (!user) {
    return null }

const role = user?.role || 'particulier'
  const initiales = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`
  const stats = STATS_BY_ROLE[role] || STATS_BY_ROLE.particulier
  const activites = ACTIVITY_BY_ROLE[role] || ACTIVITY_BY_ROLE.particulier
  const navItems = getNavItems(role)

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

        {/* ── En-tête ── */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.welcome}>Bonjour {user.prenom} 👋</h1>
            <p className={styles.welcomeSub}>Voici un aperçu de votre activité sur ITConnect</p>
          </div>
          <span className={styles.roleBadge}>{ROLE_LABELS[role]}</span>
        </div>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar} aria-label="Navigation du tableau de bord">
          <div className={styles.sidebarProfile}>
            <div className={styles.avatar}>{initiales || '?'}</div>
            <div>
              <p className={styles.profileName}>{user.prenom} {user.nom}</p>
              <p className={styles.profileRole}>{ROLE_LABELS[role]}</p>
            </div>
          </div>

          {navItems.map(item => {
            const isActive = activeNav === item.id
            const className = `${styles.navItem} ${isActive ? styles.navItemActive : ''}`

            // Si l'item a un path → NavLink avec navigation réelle
            if (item.path) {
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                  onClick={() => setActiveNav(item.id)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </NavLink>
              )
            }

            // Sinon → bouton simple (pas encore de page dédiée)
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={className}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </aside>

        {/* ── Contenu principal ── */}
        <main className={styles.main}>

          {/* Statistiques */}
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
                {s.trend && (
                  <span className={`${styles.statTrend} ${s.up ? styles.statTrendUp : styles.statTrendDown}`}>
                    {s.trend}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Activité récente */}
          <section className={styles.card} aria-labelledby="activite-title">
            <div className={styles.cardHeader}>
              <h2 id="activite-title" className={styles.cardTitle}>Activité récente</h2>
              <NavLink to="/dashboard/demandes" className={styles.cardLink}>Voir tout →</NavLink>
            </div>

            {activites.length > 0 ? (
              <div className={styles.activityList}>
                {activites.map(a => (
                  <div key={a.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[`activityIcon${a.color[0].toUpperCase()}${a.color.slice(1)}`]}`}>
                      {a.icon}
                    </div>
                    <div className={styles.activityBody}>
                      <p className={styles.activityTitle}>{a.titre}</p>
                      <p className={styles.activityMeta}>{a.meta}</p>
                    </div>
                    <StatusBadge statut={a.statut} />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Aucune activité récente pour le moment.</p>
            )}
          </section>

        </main>
      </div>

      <Footer />
    </div>
  )
}
