import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from'../services/api'
import styles from '../css/ProfilUtilisateur.module.css'

// ── Données fictives ──────────────────────────────────────────


const ROLE_LABELS = {
  particulier:  'Particulier',
  entreprise:   'Entreprise',
  professionnel:'Professionnel IT',
  admin:        'Administrateur',
}

// ── Validation infos personnelles ────────────────────────────
function validerInfos({ prenom, nom, email, ville }) {
  const erreurs = {}
  if (!prenom.trim()) erreurs.prenom = 'Le prénom est obligatoire.'
  if (!nom.trim())    erreurs.nom    = 'Le nom est obligatoire.'
  if (!email.trim()) {
    erreurs.email = 'L\'email est obligatoire.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    erreurs.email = 'L\'adresse email n\'est pas valide.'
  }
  if (!ville.trim()) erreurs.ville = 'La ville est obligatoire.'
  return erreurs
}

// ── Validation mot de passe ───────────────────────────────────
function validerMotDePasse({ actuel, nouveau, confirmation }) {
  const erreurs = {}
  if (!actuel) erreurs.actuel = 'Veuillez saisir votre mot de passe actuel.'
  if (!nouveau) {
    erreurs.nouveau = 'Veuillez saisir un nouveau mot de passe.'
  } else if (nouveau.length < 8) {
    erreurs.nouveau = 'Le mot de passe doit contenir au moins 8 caractères.'
  } else if (!/[A-Z]/.test(nouveau)) {
    erreurs.nouveau = 'Le mot de passe doit contenir au moins une majuscule.'
  } else if (!/[0-9]/.test(nouveau)) {
    erreurs.nouveau = 'Le mot de passe doit contenir au moins un chiffre.'
  }
  if (!confirmation) {
    erreurs.confirmation = 'Veuillez confirmer le nouveau mot de passe.'
  } else if (confirmation !== nouveau) {
    erreurs.confirmation = 'Les mots de passe ne correspondent pas.'
  }
  return erreurs
}

// ── Composant ─────────────────────────────────────────────────
export default function ProfilUtilisateur() {
  // Récupère l'utilisateur réel si connecté, sinon utilise le fallback fictif
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const userData = storedUser || FAKE_USER

  // ── État section Infos personnelles ──
  const [infos, setInfos] = useState({
    prenom: userData.prenom || '',
    nom:    userData.nom    || '',
    email:  userData.email  || '',
    ville:  userData.ville  || '',
  })
  const [erreursInfos, setErreurInfos]     = useState({})
  const [loadingInfos, setLoadingInfos]   = useState(false)
  const [succesInfos, setSuccesInfos]     = useState(false)
  const [erreurInfosGlobal, setErreurInfosGlobal] = useState('')

  // ── État section Mot de passe ──
  const [mdp, setMdp] = useState({ actuel: '', nouveau: '', confirmation: '' })
  const [erreursMdp, setErreursMdp]       = useState({})
  const [loadingMdp, setLoadingMdp]       = useState(false)
  const [succesMdp, setSuccesMdp]         = useState(false)
  const [erreurMdpGlobal, setErreurMdpGlobal] = useState('')
  const [showActuel, setShowActuel]       = useState(false)
  const [showNouveau, setShowNouveau]     = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)

  // ── Handlers Infos ──
  function handleInfosChange(e) {
    const { name, value } = e.target
    setInfos(prev => ({ ...prev, [name]: value }))
    if (erreursInfos[name]) setErreurInfos(prev => ({ ...prev, [name]: '' }))
    if (succesInfos) setSuccesInfos(false)
    if (erreurInfosGlobal) setErreurInfosGlobal('')
  }

  function resetInfos() {
    setInfos({
      prenom: userData.prenom || '',
      nom:    userData.nom    || '',
      email:  userData.email  || '',
      ville:  userData.ville  || '',
    })
    setErreurInfos({})
    setSuccesInfos(false)
    setErreurInfosGlobal('')
  }

  async function handleInfosSubmit(e) {
  e.preventDefault()
  const erreurs = validerInfos(infos)
  if (Object.keys(erreurs).length > 0) { setErreurInfos(erreurs); return }

  setLoadingInfos(true)
  setErreurInfosGlobal('')
  try {
    const res = await api.put('/auth/me', infos)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setSuccesInfos(true)
  } catch (err) {
    const message = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
    setErreurInfosGlobal(message)
  } finally {
    setLoadingInfos(false)
  }
}

  // ── Handlers Mot de passe ──
  function handleMdpChange(e) {
    const { name, value } = e.target
    setMdp(prev => ({ ...prev, [name]: value }))
    if (erreursMdp[name]) setErreursMdp(prev => ({ ...prev, [name]: '' }))
    if (succesMdp) setSuccesMdp(false)
    if (erreurMdpGlobal) setErreurMdpGlobal('')
  }

 async function handleMdpSubmit(e) {
  e.preventDefault()
  const erreurs = validerMotDePasse(mdp)
  if (Object.keys(erreurs).length > 0) { setErreursMdp(erreurs); return }

  setLoadingMdp(true)
  setErreurMdpGlobal('')
  try {
    await api.put('/auth/mot-de-passe', {
      actuel: mdp.actuel,
      nouveau: mdp.nouveau,
    })
    setSuccesMdp(true)
    setMdp({ actuel: '', nouveau: '', confirmation: '' })
  } catch (err) {
    const message = err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
    setErreurMdpGlobal(message)
  } finally {
    setLoadingMdp(false)
  }
}

  const initiales = `${infos.prenom?.[0] || ''}${infos.nom?.[0] || ''}`

  async function handleDeleteAccount() {
  const confirme = window.confirm(
    'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est définitive et irréversible.'
  )
  if (!confirme) return

  try {
    await api.delete('/auth/me')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  } catch (err) {
    alert(err.response?.data?.message || 'Impossible de supprimer le compte. Réessayez plus tard.')
  }
}

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>

        {/* ── En-tête ── */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Mon profil</h1>
          <p className={styles.subtitle}>Gérez vos informations personnelles et la sécurité de votre compte</p>
        </div>

        <div className={styles.layout}>

          {/* ══ COLONNE GAUCHE — Résumé ══ */}
          <aside>
            <div className={styles.summaryCard}>
              <div className={styles.avatar}>{initiales || '?'}</div>
              <div>
                <p className={styles.summaryName}>{infos.prenom} {infos.nom}</p>
                <p className={styles.summaryEmail}>{infos.email}</p>
                <span className={styles.roleBadge}>{ROLE_LABELS[userData.role] || 'Utilisateur'}</span>
              </div>
              <ul className={styles.summaryMeta}>
                <li className={styles.summaryMetaItem}>
                  <span className={styles.summaryMetaIcon}>📍</span>
                  {infos.ville || 'Ville non renseignée'}
                </li>
                <li className={styles.summaryMetaItem}>
                  <span className={styles.summaryMetaIcon}>📅</span>
                  Membre depuis {userData.membre || '2025'}
                </li>
              </ul>
            </div>
          </aside>

          {/* ══ COLONNE DROITE ══ */}
          <main className={styles.main}>

            {/* ── Section 1 : Infos personnelles ── */}
            <section className={styles.card} aria-labelledby="infos-title">
              <div className={styles.cardHeader}>
                <h2 id="infos-title" className={styles.cardTitle}>
                  👤 Informations personnelles
                </h2>
                <p className={styles.cardSubtitle}>
                  Ces informations sont visibles sur votre profil public.
                </p>
              </div>

              {succesInfos && (
                <div className={styles.successBanner} role="status">
                  ✅ Vos informations ont bien été enregistrées.
                </div>
              )}
              {erreurInfosGlobal && (
                <div className={styles.errorBanner} role="alert">
                  ⚠️ {erreurInfosGlobal}
                </div>
              )}

              <form onSubmit={handleInfosSubmit} className={styles.form} noValidate>

                {/* Prénom + Nom */}
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prenom" className={styles.label}>Prénom</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon} aria-hidden="true">👤</span>
                      <input
                        id="prenom" name="prenom" type="text"
                        autoComplete="given-name"
                        placeholder="Votre prénom"
                        value={infos.prenom}
                        onChange={handleInfosChange}
                        className={`${styles.input} ${erreursInfos.prenom ? styles.inputError : ''}`}
                        aria-invalid={!!erreursInfos.prenom}
                      />
                    </div>
                    {erreursInfos.prenom && <p className={styles.errorMsg} role="alert">⚠ {erreursInfos.prenom}</p>}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="nom" className={styles.label}>Nom</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon} aria-hidden="true">👤</span>
                      <input
                        id="nom" name="nom" type="text"
                        autoComplete="family-name"
                        placeholder="Votre nom"
                        value={infos.nom}
                        onChange={handleInfosChange}
                        className={`${styles.input} ${erreursInfos.nom ? styles.inputError : ''}`}
                        aria-invalid={!!erreursInfos.nom}
                      />
                    </div>
                    {erreursInfos.nom && <p className={styles.errorMsg} role="alert">⚠ {erreursInfos.nom}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.label}>Adresse email</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon} aria-hidden="true">✉️</span>
                    <input
                      id="email" name="email" type="email"
                      autoComplete="email"
                      placeholder="votre@email.com"
                      value={infos.email}
                      onChange={handleInfosChange}
                      className={`${styles.input} ${erreursInfos.email ? styles.inputError : ''}`}
                      aria-invalid={!!erreursInfos.email}
                    />
                  </div>
                  {erreursInfos.email && <p className={styles.errorMsg} role="alert">⚠ {erreursInfos.email}</p>}
                </div>

                {/* Ville */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="ville" className={styles.label}>Ville</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon} aria-hidden="true">📍</span>
                    <input
                      id="ville" name="ville" type="text"
                      autoComplete="address-level2"
                      placeholder="Votre ville"
                      value={infos.ville}
                      onChange={handleInfosChange}
                      className={`${styles.input} ${erreursInfos.ville ? styles.inputError : ''}`}
                      aria-invalid={!!erreursInfos.ville}
                    />
                  </div>
                  {erreursInfos.ville && <p className={styles.errorMsg} role="alert">⚠ {erreursInfos.ville}</p>}
                </div>

                {/* Rôle (lecture seule) */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Rôle</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon} aria-hidden="true">🏷️</span>
                    <input
                      type="text"
                      value={ROLE_LABELS[userData.role] || 'Utilisateur'}
                      className={`${styles.input} ${styles.inputDisabled}`}
                      disabled
                      aria-label="Rôle non modifiable"
                    />
                  </div>
                  <p className={styles.fieldHint}>Le rôle ne peut pas être modifié après l'inscription.</p>
                </div>

                <div className={styles.formActions}>
                  <button type="button" className={styles.btnSecondary} onClick={resetInfos}>
                    Annuler
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={loadingInfos}>
                    {loadingInfos && <span className={styles.spinner} aria-hidden="true" />}
                    {loadingInfos ? 'Enregistrement…' : '💾 Enregistrer'}
                  </button>
                </div>

              </form>
            </section>

            {/* ── Section 2 : Sécurité / Mot de passe ── */}
            <section className={styles.card} aria-labelledby="mdp-title">
              <div className={styles.cardHeader}>
                <h2 id="mdp-title" className={styles.cardTitle}>
                  🔒 Sécurité
                </h2>
                <p className={styles.cardSubtitle}>
                  Modifiez votre mot de passe pour sécuriser votre compte.
                </p>
              </div>

              {succesMdp && (
                <div className={styles.successBanner} role="status">
                  ✅ Mot de passe modifié avec succès.
                </div>
              )}
              {erreurMdpGlobal && (
                <div className={styles.errorBanner} role="alert">
                  ⚠️ {erreurMdpGlobal}
                </div>
              )}

              <form onSubmit={handleMdpSubmit} className={styles.form} noValidate>

                {/* Mot de passe actuel */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="actuel" className={styles.label}>Mot de passe actuel</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon} aria-hidden="true">🔒</span>
                    <input
                      id="actuel" name="actuel"
                      type={showActuel ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Votre mot de passe actuel"
                      value={mdp.actuel}
                      onChange={handleMdpChange}
                      className={`${styles.input} ${erreursMdp.actuel ? styles.inputError : ''}`}
                      aria-invalid={!!erreursMdp.actuel}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowActuel(v => !v)} aria-label={showActuel ? 'Masquer' : 'Afficher'}>
                      {showActuel ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {erreursMdp.actuel && <p className={styles.errorMsg} role="alert">⚠ {erreursMdp.actuel}</p>}
                </div>

                {/* Nouveau mot de passe */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="nouveau" className={styles.label}>Nouveau mot de passe</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon} aria-hidden="true">🔑</span>
                    <input
                      id="nouveau" name="nouveau"
                      type={showNouveau ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="8 caractères min., 1 majuscule, 1 chiffre"
                      value={mdp.nouveau}
                      onChange={handleMdpChange}
                      className={`${styles.input} ${erreursMdp.nouveau ? styles.inputError : ''}`}
                      aria-invalid={!!erreursMdp.nouveau}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowNouveau(v => !v)} aria-label={showNouveau ? 'Masquer' : 'Afficher'}>
                      {showNouveau ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {erreursMdp.nouveau && <p className={styles.errorMsg} role="alert">⚠ {erreursMdp.nouveau}</p>}
                </div>

                {/* Confirmation */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="confirmation" className={styles.label}>Confirmer le nouveau mot de passe</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon} aria-hidden="true">🔑</span>
                    <input
                      id="confirmation" name="confirmation"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Répétez le nouveau mot de passe"
                      value={mdp.confirmation}
                      onChange={handleMdpChange}
                      className={`${styles.input} ${erreursMdp.confirmation ? styles.inputError : ''}`}
                      aria-invalid={!!erreursMdp.confirmation}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Masquer' : 'Afficher'}>
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {erreursMdp.confirmation && <p className={styles.errorMsg} role="alert">⚠ {erreursMdp.confirmation}</p>}
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => { setMdp({ actuel: '', nouveau: '', confirmation: '' }); setErreursMdp({}) }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={loadingMdp}>
                    {loadingMdp && <span className={styles.spinner} aria-hidden="true" />}
                    {loadingMdp ? 'Modification…' : '🔒 Modifier le mot de passe'}
                  </button>
                </div>

              </form>
            </section>

            {/* ── Zone danger ── */}
            <div className={styles.dangerCard}>
              <h3 className={styles.dangerTitle}>⚠️ Zone de danger</h3>
              <p className={styles.dangerText}>
                La suppression de votre compte est définitive. Toutes vos données seront effacées et ne pourront pas être récupérées.
              </p>
              <button
                      className={styles.btnDanger}
                       onClick={handleDeleteAccount}
                                                    >
                       Supprimer mon compte
</button>
              
            </div>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
