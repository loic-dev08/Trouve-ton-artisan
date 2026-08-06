import api from '../services/api'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from '../css/Auth.module.css'

// ── Règles de validation ──────────────────────────────────────
function valider({ email, motDePasse }) {
  const erreurs = {}

  if (!email.trim()) {
    erreurs.email = 'L\'adresse email est obligatoire.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erreurs.email = 'L\'adresse email n\'est pas valide.'
  }

  if (!motDePasse) {
    erreurs.motDePasse = 'Le mot de passe est obligatoire.'
  } else if (motDePasse.length < 6) {
    erreurs.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères.'
  }

  return erreurs
}

// ── Composant ─────────────────────────────────────────────────
export default function Connexion() {
  const [form, setForm]           = useState({ email: '', motDePasse: '' })
  const [erreurs, setErreurs]     = useState({})
  const [erreurGlobal, setErreurGlobal] = useState('')
  const [loading, setLoading]     = useState(false)
  const [showMdp, setShowMdp]     = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Efface l'erreur du champ modifié
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
  const res = await api.post('/auth/connexion', {
    email: form.email,
    motDePasse: form.motDePasse,
  })
  const { token, user } = res.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  navigate('/dashboard')

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

          <h1 className={styles.title}>Connexion</h1>
          <p className={styles.subtitle}>Bon retour ! Connectez-vous à votre espace.</p>

          {/* Bannière erreur globale */}
          {erreurGlobal && (
            <div className={styles.errorBanner} role="alert">
              ⚠️ {erreurGlobal}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

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
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
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

            {/* Mot de passe oublié */}
            <Link to="/mot-de-passe-oublie" className={styles.forgotLink}>
              Mot de passe oublié ?
            </Link>

            {/* Bouton submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              aria-busy={loading}
            >
              {loading && <span className={styles.spinner} aria-hidden="true" />}
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </button>

          </form>

          <div className={styles.divider}>ou</div>

          <p className={styles.switchText}>
            Pas encore de compte ?{' '}
            <Link to="/inscription" className={styles.switchLink}>
              Créer un compte gratuitement
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  )
}
