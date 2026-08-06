import api from '../services/api'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from '../css/Auth.module.css'

// ── Règles de validation ──────────────────────────────────────
function valider({ prenom, nom, email, motDePasse, confirmation }) {
  const erreurs = {}

  if (!prenom.trim()) {
    erreurs.prenom = 'Le prénom est obligatoire.'
  }

  if (!nom.trim()) {
    erreurs.nom = 'Le nom est obligatoire.'
  }

  if (!email.trim()) {
    erreurs.email = 'L\'adresse email est obligatoire.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erreurs.email = 'L\'adresse email n\'est pas valide.'
  }

  if (!motDePasse) {
    erreurs.motDePasse = 'Le mot de passe est obligatoire.'
  } else if (motDePasse.length < 8) {
    erreurs.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères.'
  } else if (!/[A-Z]/.test(motDePasse)) {
    erreurs.motDePasse = 'Le mot de passe doit contenir au moins une majuscule.'
  } else if (!/[0-9]/.test(motDePasse)) {
    erreurs.motDePasse = 'Le mot de passe doit contenir au moins un chiffre.'
  }

  if (!confirmation) {
    erreurs.confirmation = 'Veuillez confirmer votre mot de passe.'
  } else if (confirmation !== motDePasse) {
    erreurs.confirmation = 'Les mots de passe ne correspondent pas.'
  }

  return erreurs
}

const ROLES = [
  { value: 'particulier',  label: 'Particulier',     icon: '👤', desc: 'Je cherche un professionnel artisan' },
  { value: 'entreprise',   label: 'Entreprise',       icon: '🏢', desc: 'Je gère des prestataires artisans' },
  { value: 'professionnel',label: 'Professionnel IT', icon: '💻', desc: 'Je propose mes services artisanats' },
]

// ── Composant ─────────────────────────────────────────────────
export default function Inscription() {
  const [searchParams] = useSearchParams()
  const roleInitial = searchParams.get('role') || 'particulier'

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    motDePasse: '',
    confirmation: '',
    role: ROLES.find(r => r.value === roleInitial) ? roleInitial : 'particulier',
  })
  const [erreurs, setErreurs]           = useState({})
  const [erreurGlobal, setErreurGlobal] = useState('')
  const [succes, setSucces]             = useState(false)
  const [loading, setLoading]           = useState(false)
  const [showMdp, setShowMdp]           = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erreurs[name]) setErreurs(prev => ({ ...prev, [name]: '' }))
    if (erreurGlobal)  setErreurGlobal('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validation
    const erreursValidation = valider(form)
    if (Object.keys(erreursValidation).length > 0) {
      setErreurs(erreursValidation)
      return
    }

    setLoading(true)
    setErreurGlobal('')

    try {
  const res = await api.post('/auth/inscription', {
    prenom: form.prenom,
    nom: form.nom,
    email: form.email,
    motDePasse: form.motDePasse,
    role: form.role,
  })
  const { token, user } = res.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  setSucces(true)
  setTimeout(() => navigate('/dashboard'), 2000)

} catch (err) {
  const message = err.response?.data?.message || 'Une erreur est survenue.'
  setErreurGlobal(message)
} finally {
  setLoading(false)
}
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.card}>

          {/* Logo */}
          <Link to="/" className={styles.logo} aria-label="Retour à l'accueil">
            <span className={styles.logoIt}>IT</span>
            <span className={styles.logoConnect}>Connect</span>
          </Link>

          <h1 className={styles.title}>Créer un compte</h1>
          <p className={styles.subtitle}>Rejoignez des centaines d'utilisateurs sur Trouve ton artisan.</p>

          {/* Bannière succès */}
          {succes && (
            <div className={styles.successBanner} role="status">
              ✅ Compte créé avec succès ! Redirection en cours…
            </div>
          )}

          {/* Bannière erreur globale */}
          {erreurGlobal && (
            <div className={styles.errorBanner} role="alert">
              ⚠️ {erreurGlobal}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Choix du rôle */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Je suis…</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: r.value }))}
                    style={{
                      flex: '1 1 120px',
                      padding: '10px 8px',
                      borderRadius: 10,
                      border: `1.5px solid ${form.role === r.value ? '#7A45E0' : 'rgba(140,90,230,0.2)'}`,
                      background: form.role === r.value ? 'rgba(122,69,224,0.08)' : '#FAFAFE',
                      color: form.role === r.value ? '#7A45E0' : '#6A5F8A',
                      fontWeight: form.role === r.value ? 700 : 500,
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'center',
                      transition: 'all .15s',
                    }}
                    aria-pressed={form.role === r.value}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prénom + Nom côte à côte */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

              {/* Prénom */}
              <div className={styles.fieldGroup}>
                <label htmlFor="prenom" className={styles.label}>Prénom</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon} aria-hidden="true">👤</span>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Prénom"
                    value={form.prenom}
                    onChange={handleChange}
                    className={`${styles.input} ${erreurs.prenom ? styles.inputError : ''}`}
                    aria-describedby={erreurs.prenom ? 'prenom-error' : undefined}
                    aria-invalid={!!erreurs.prenom}
                  />
                </div>
                {erreurs.prenom && (
                  <p id="prenom-error" className={styles.errorMsg} role="alert">
                    ⚠ {erreurs.prenom}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div className={styles.fieldGroup}>
                <label htmlFor="nom" className={styles.label}>Nom</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon} aria-hidden="true">👤</span>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Nom"
                    value={form.nom}
                    onChange={handleChange}
                    className={`${styles.input} ${erreurs.nom ? styles.inputError : ''}`}
                    aria-describedby={erreurs.nom ? 'nom-error' : undefined}
                    aria-invalid={!!erreurs.nom}
                  />
                </div>
                {erreurs.nom && (
                  <p id="nom-error" className={styles.errorMsg} role="alert">
                    ⚠ {erreurs.nom}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>Adresse email</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon} aria-hidden="true">✉️</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`${styles.input} ${erreurs.email ? styles.inputError : ''}`}
                  aria-describedby={erreurs.email ? 'email-error' : undefined}
                  aria-invalid={!!erreurs.email}
                />
              </div>
              {erreurs.email && (
                <p id="email-error" className={styles.errorMsg} role="alert">
                  ⚠ {erreurs.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className={styles.fieldGroup}>
              <label htmlFor="motDePasse" className={styles.label}>Mot de passe</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon} aria-hidden="true">🔒</span>
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type={showMdp ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="8 caractères min., 1 majuscule, 1 chiffre"
                  value={form.motDePasse}
                  onChange={handleChange}
                  className={`${styles.input} ${erreurs.motDePasse ? styles.inputError : ''}`}
                  aria-describedby={erreurs.motDePasse ? 'mdp-error' : undefined}
                  aria-invalid={!!erreurs.motDePasse}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowMdp(v => !v)}
                  aria-label={showMdp ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showMdp ? '🙈' : '👁️'}
                </button>
              </div>
              {erreurs.motDePasse && (
                <p id="mdp-error" className={styles.errorMsg} role="alert">
                  ⚠ {erreurs.motDePasse}
                </p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div className={styles.fieldGroup}>
              <label htmlFor="confirmation" className={styles.label}>Confirmer le mot de passe</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon} aria-hidden="true">🔒</span>
                <input
                  id="confirmation"
                  name="confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Répétez votre mot de passe"
                  value={form.confirmation}
                  onChange={handleChange}
                  className={`${styles.input} ${erreurs.confirmation ? styles.inputError : ''}`}
                  aria-describedby={erreurs.confirmation ? 'confirm-error' : undefined}
                  aria-invalid={!!erreurs.confirmation}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? 'Masquer' : 'Afficher'}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {erreurs.confirmation && (
                <p id="confirm-error" className={styles.errorMsg} role="alert">
                  ⚠ {erreurs.confirmation}
                </p>
              )}
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || succes}
              aria-busy={loading}
            >
              {loading && <span className={styles.spinner} aria-hidden="true" />}
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>

          </form>

          <div className={styles.divider}>ou</div>

          <p className={styles.switchText}>
            Déjà un compte ?{' '}
            <Link to="/connexion" className={styles.switchLink}>
              Se connecter
            </Link>
          </p>

        </div>     
      </main>

      <Footer />
    </div>
  )
}
