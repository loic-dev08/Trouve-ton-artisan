//src/component/Footer.jsx

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
        <div className={styles.logo}>
            <span className={styles.logoTrouve}>Trouve</span>
            <span className={styles.logotonartisan}>ton artisan</span>
        </div>
      <p className={styles.copyright}>© 2026 Trouve ton artisan. All rights reserved.</p>
      <p className={styles.tagline}>
       Mise en relation d'artisans.  Lyon . Grenoble . Valence . Évian . Chambéry . Annecy .
      </p>
    </footer>
  );
}