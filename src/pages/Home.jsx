import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProCard from '../components/ProCard'
import StarRating from '../components/StarRating'
import api from '../services/api'
import styles from '../css/Home.module.css'

const TEMOIGNAGES = [
  { id: 1, auteur: 'Claire Girard',    role: 'Particulier',  ville: 'Lyon', note: 5, texte: 'Larry a configuré mon réseau en moins d\'une heure. Service impeccable, je recommande vivement !', initiales: 'CG' },
  { id: 2, auteur: 'Pierre Garnier',   role: 'DataSolutions SAS', ville: 'Grenoble', note: 5, texte: 'Lucie gère notre parc de 40 postes avec une efficacité remarquable. Partenaire de confiance depuis 2 ans.', initiales: 'PG' },
  { id: 3, auteur: 'Manon Bouchard',   role: 'Particulier',  ville: 'Villeurbanne',  note: 4, texte: 'Amélie a créé mon site vitrine en 3 semaines. Design moderne et livraison dans les délais.', initiales: 'MB' },
]

const CATEGORIES = [
  {
    id: 'professionnel',
    label: 'Professionnel ',
    icon: '💻',
    desc: 'Boucher, Boulanger, Chocolatier, Traiteur, Chauffagiste, Electricien, Menuisier, Plombier,Bijoutier, Couturier,Ferronier, Coiffeur,Fleuriste,Toiletteur, Webdesign. Inscrivez-vous et trouvez vos prochains clients.',
    cta: 'Créer mon profil pro',
    card: 'catCardBlue',
    label_: 'catLabelBlue',
    btn: 'catBtnBlue',
  },
  {
    id: 'entreprise',
    label: 'Entreprise',
    icon: '🏢',
    desc: 'Trouvez rapidement un artisan qualifié pour vos projets ponctuels ou vos besoins de dépannage.',
    cta: 'Trouver un prestataire',
    card: 'catCardTeal',
    label_: 'catLabelTeal',
    btn: 'catBtnTeal',
  },
  {
    id: 'particulier',
    label: 'Particulier',
    icon: '👤',
    desc: 'Besoin de dépannage, d\'installation ? Trouvez un pro près de chez vous.',
    cta: 'Trouver de l\'aide',
    card: 'catCardPurple',
    label_: 'catLabelPurple',
    btn: 'catBtnPurple',
  },
]

// --- Composant étoiles inline ---
function Stars({ note }) {
  return (
    <span aria-label={`Note : ${note} sur 5`}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          className={i <= Math.round(note) ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </span>
  )
}

// --- Page Home ---
export default function Home() {
  const [specialite, setSpecialite] = useState('')
  const [ville, setVille]           = useState('')
  const [prosVedette, setProsVedette] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function chargerProsVedette() {
      try {
        const res = await api.get('/professionnels', { params: { limit: 6 } })
        setProsVedette(res.data.professionnels)
      } catch (err) {
        setProsVedette([])
      }
    }
    chargerProsVedette()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (specialite) params.set('specialite', specialite)
    if (ville)      params.set('ville', ville)
    navigate(`/recherche?${params.toString()}`)
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero} aria-label="Présentation Trouve ton artisan">
        {/* Halo décoratif */}
        <div className={styles.halo1} aria-hidden="true" />
        <div className={styles.halo2} aria-hidden="true" />

        <div className={styles.heroInner}>
          {/* Texte gauche */}
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Plateforme de mise en relation d'artisans</span>
            <h1 className={styles.h1}>
              Connectez-vous aux<br />
              <span className={styles.h1Accent}>meilleurs experts en artisanat</span><br />
              près de chez vous
            </h1>
            <p className={styles.heroSub}>
              Particuliers, entreprises — trouvez en quelques secondes un professionnel qualifié pour votre dépannage.
            </p>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className={styles.searchForm} role="search" aria-label="Rechercher un artisan">
              <div className={styles.searchRow}>
                <div className={styles.searchField}>
                  <span className={styles.searchIcon} aria-hidden="true">🔍</span>
                  <input
                    type="text"
                    placeholder="Spécialité (ex : plomberie, coiffure…)"
                    value={specialite}
                    onChange={e => setSpecialite(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Spécialité recherchée"
                  />
                </div>
                <div className={styles.searchField}>
                  <span className={styles.searchIcon} aria-hidden="true">📍</span>
                  <input
                    type="text"
                    placeholder="Ville (ex : Lyon, Grenoble…)"
                    value={ville}
                    onChange={e => setVille(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Ville"
                  />
                </div>
                <button type="submit" className={styles.searchBtn}>
                  Rechercher
                </button>
              </div>
            </form>

            {/* CTA secondaires */}
            <div className={styles.heroCtas}>
              <button onClick={() => navigate('/inscription')} className={styles.ctaPrimary}>
                Créer un compte
              </button>
              <button onClick={() => navigate('/connexion')} className={styles.ctaSecondary}>
                Se connecter
              </button>
            </div>
          </div>

          {/* Illustration droite */}
          <div className={styles.heroIllus} aria-hidden="true">
            <svg viewBox="0 0 320 280" width="100%" style={{ maxWidth: 340 }}>
              {/* Écran */}
              <rect x="60" y="20" width="200" height="155" rx="16" fill="#ECE4FF" stroke="rgba(140,90,230,0.4)" strokeWidth="1.5"/>
              <rect x="72" y="32" width="176" height="131" rx="10" fill="#FFFFFF"/>
              {/* Ligne connexion */}
              <line x1="118" y1="98" x2="202" y2="98" stroke="#2F7FD8" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="160" cy="98" r="5" fill="#2F7FD8" opacity="0.5"/>
              <circle cx="137" cy="98" r="3" fill="#2F7FD8" opacity="0.3"/>
              <circle cx="183" cy="98" r="3" fill="#2F7FD8" opacity="0.3"/>
              {/* Nœud user */}
              <circle cx="112" cy="98" r="20" fill="#ECE4FF"/>
              <circle cx="112" cy="90" r="7" fill="#7A45E0"/>
              <path d="M95 116 Q112 107 129 116" fill="#7A45E0"/>
              {/* Nœud serveur */}
              <rect x="186" y="76" width="40" height="44" rx="9" fill="#7A45E0"/>
              <rect x="193" y="85" width="26" height="4" rx="2" fill="#FFFFFF"/>
              <rect x="193" y="93" width="26" height="4" rx="2" fill="#FFFFFF"/>
              <rect x="193" y="101" width="16" height="4" rx="2" fill="#FFFFFF"/>
              <circle cx="222" cy="110" r="5" fill="#18A87C"/>
              {/* Pied écran */}
              <rect x="146" y="175" width="28" height="14" rx="3" fill="#ECE4FF"/>
              <rect x="120" y="187" width="80" height="10" rx="5" fill="#DCD0FA"/>
              {/* Stats flottantes */}
              <rect x="10" y="55" width="90" height="38" rx="10" fill="#EAFAF3" stroke="#18A87C" strokeWidth="1"/>
              <text x="19" y="72" fontSize="10" fill="#18A87C" fontFamily="system-ui">✓ En ligne</text>
              <text x="19" y="86" fontSize="9" fill="#4A9A7A" fontFamily="system-ui">24 professionnels</text>
              <rect x="220" y="160" width="90" height="38" rx="10" fill="#F1EAFF" stroke="#7A45E0" strokeWidth="1"/>
              <text x="229" y="177" fontSize="10" fill="#7A45E0" fontFamily="system-ui">★ 4.8 / 5</text>
              <text x="229" y="191" fontSize="9" fill="#8478A0" fontFamily="system-ui">Note moyenne</text>
              {/* Bulle notification */}
              <rect x="185" y="20" width="110" height="32" rx="10" fill="#EAF2FF" stroke="#2F7FD8" strokeWidth="1"/>
              <text x="195" y="33" fontSize="9" fill="#2F7FD8" fontFamily="system-ui">💬 Nouvelle demande</text>
              <text x="195" y="45" fontSize="8" fill="#7A8AAB" fontFamily="system-ui">il y a 2 minutes</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section className={styles.section} aria-labelledby="cat-title">
        <div className={styles.sectionInner}>
          <h2 id="cat-title" className={styles.h2}>Vous êtes…</h2>
          <p className={styles.h2Sub}>ITConnect s'adapte à votre profil</p>
          <div className={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} className={`${styles.catCard} ${styles[cat.card]}`}>
                <span className={styles.catIcon}>{cat.icon}</span>
                <h3 className={`${styles.catLabel} ${styles[cat.label_]}`}>{cat.label}</h3>
                <p className={styles.catDesc}>{cat.desc}</p>
                <button
                  onClick={() => navigate(`/inscription?role=${cat.id}`)}
                  className={`${styles.catBtn} ${styles[cat.btn]}`}
                >
                  {cat.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROS EN VEDETTE ── */}
      <section className={styles.sectionAlt} aria-labelledby="pros-title">
        <div className={styles.sectionInner}>
          <h2 id="pros-title" className={styles.h2}>Professionnels en vedette</h2>
          <p className={styles.h2Sub}>Des experts vérifiés dans votre région</p>
          <div className={styles.prosGrid}>
            {prosVedette.map(pro => {
              const nom = `${pro.user?.prenom || ''} ${pro.user?.nom || ''}`.trim()
              const initiales = `${pro.user?.prenom?.[0] || ''}${pro.user?.nom?.[0] || ''}`
              const note = pro.note_moyenne ? parseFloat(pro.note_moyenne) : 0
              return (
                <article
                  key={pro.id}
                  className={styles.proCard}
                  onClick={() => navigate(`/pro/${pro.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Voir le profil de ${nom}`}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/pro/${pro.id}`)}
                >
                  <div className={styles.proCardTop}>
                    <div className={styles.proAvatar}>{initiales}</div>
                    <span className={`${styles.dispoBadge} ${pro.disponible ? styles.on : styles.off}`}>
                      {pro.disponible ? '● Disponible' : '○ Occupé'}
                    </span>
                  </div>
                  <h3 className={styles.proName}>{nom}</h3>
                  <p className={styles.proSpec}>{pro.specialite}</p>
                  <p className={styles.proVille}>📍 {pro.ville}</p>
                  <div className={styles.proFooter}>
                    <Stars note={note} />
                    <span className={styles.proNote}>{note}/5 · {pro.nombre_avis || 0} avis</span>
                  </div>
                </article>
              )
            })}
          </div>
          <div className={styles.centre}>
            <button onClick={() => navigate('/recherche')} className={styles.ctaPrimary}>
              Voir tous les professionnels →
            </button>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className={styles.section} aria-labelledby="temoignages-title">
        <div className={styles.sectionInner}>
          <h2 id="temoignages-title" className={styles.h2}>Ce qu'ils en disent</h2>
          <p className={styles.h2Sub}>Des utilisateurs satisfaits partout en région</p>
          <div className={styles.temGrid}>
            {TEMOIGNAGES.map(t => (
              <figure key={t.id} className={styles.temCard}>
                <div className={styles.temHeader}>
                  <div className={styles.temAvatar}>{t.initiales}</div>
                  <div>
                    <figcaption className={styles.temNom}>{t.auteur}</figcaption>
                    <span className={styles.temRole}>{t.role} · {t.ville}</span>
                  </div>
                </div>
                <Stars note={t.note} />
                <blockquote className={styles.temTexte}>"{t.texte}"</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className={styles.ctaSection} aria-label="Appel à l'action">
        <div className={styles.sectionInner}>
          <h2 className={`${styles.h2} ${styles.ctaSectionTitle}`}>Prêt à vous connecter ?</h2>
          <p className={`${styles.h2Sub} ${styles.ctaSectionSub}`}>Rejoignez des centaines d'utilisateurs qui font confiance à Trouve ton artisan</p>
          <div className={styles.centre}>
            <button onClick={() => navigate('/inscription')} className={`${styles.ctaPrimary} ${styles.ctaFinalBtn}`}>
              Créer mon compte gratuitement
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
