import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from '../css/NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.content}>

          {/* Illustration */}
          <span className={styles.icon} aria-hidden="true">🔌</span>
          <p className={styles.code}>404</p>

          <h1 className={styles.title}>Page introuvable</h1>
          <p className={styles.subtitle}>
            Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
            Pas de panique, vous pouvez retourner à l'accueil ou explorer nos professionnels.
          </p>

          {/* Actions principales */}
          <div className={styles.actions}>
            <Link to="/" className={styles.btnPrimary}>
              🏠 Retour à l'accueil
            </Link>
            <button
              onClick={() => navigate(-1)}
              className={styles.btnSecondary}
            >
              ← Page précédente
            </button>
          </div>

          {/* Liens rapides */}
          <div className={styles.quickLinks}>
            <p className={styles.quickLinksTitle}>Où souhaitez-vous aller ?</p>
            <div className={styles.linksList}>
              <Link to="/recherche" className={styles.quickLink}>
                🔍 Rechercher un pro
              </Link>
              <Link to="/inscription" className={styles.quickLink}>
                ✨ Créer un compte
              </Link>
              <Link to="/connexion" className={styles.quickLink}>
                🔑 Se connecter
              </Link>
              <Link to="/dashboard" className={styles.quickLink}>
                📊 Mon dashboard
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
