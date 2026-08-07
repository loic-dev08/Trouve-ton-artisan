// src/components/Footer.jsx
import styles from '../css/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <span className={styles.logoIt}>IT</span>
        <span className={styles.logoConnect}>Connect</span>
      </div>
      <p className={styles.copyright}>© 2026 Trouve ton Artisan — Tous droits réservés</p>
      <p className={styles.tagline}>
        Mise en relation d'artisans · Lyon · Valence · Chambéry - Montélimar  - Grenoble - Evian
      </p>
    </footer>
  )
}
