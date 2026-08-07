import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from '../css/Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Récupère l'utilisateur depuis localStorage (AuthContext à brancher plus tard)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function handleLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
    setMenuOpen(false)
  }

  function linkClass({ isActive }) {
    return isActive ? `${styles.link} ${styles.linkActive}` : styles.link
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navigation principale">

        {/* ── Logo ── */}
        <NavLink to="/" className={styles.logo} aria-label="ITConnect — Accueil">
          <svg width="28" height="28" viewBox="0 0 60 60" aria-hidden="true">
            <rect width="60" height="60" rx="12" fill="#2F7FD8"/>
            <rect x="4" y="4" width="52" height="52" rx="9" fill="#FFFFFF"/>
            <line x1="18" y1="30" x2="42" y2="30" stroke="#7A45E0" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="30" cy="30" r="3" fill="#7A45E0" opacity="0.6"/>
            <circle cx="15" cy="30" r="7" fill="#2F7FD8"/>
            <circle cx="15" cy="27" r="2.5" fill="#ECE4FF"/>
            <path d="M9 37 Q15 33 21 37" fill="#ECE4FF"/>
            <rect x="37" y="22" width="14" height="16" rx="3" fill="#7A45E0"/>
            <rect x="39" y="26" width="10" height="2" rx="1" fill="#FFFFFF"/>
            <rect x="39" y="30" width="10" height="2" rx="1" fill="#FFFFFF"/>
            <circle cx="49" cy="35" r="2" fill="#18A87C"/>
          </svg>
          <span className={styles.logoText}>
            <span className={styles.logoIt}>IT</span>
            <span className={styles.logoConnect}>Connect</span>
          </span>
        </NavLink>

        {/* ── Liens desktop ── */}
       <ul className={styles.links} role="list">
      <li><NavLink to="/recherche"   className={linkClass}>Rechercher</NavLink></li>
      <li><NavLink to="/recherche"   className={linkClass}>Professionnels</NavLink></li>
      <li><NavLink to="/entreprises" className={linkClass}>Entreprises</NavLink></li>
  {user && (
    <li><NavLink to="/dashboard" className={linkClass}>Mon espace</NavLink></li>
  )}
</ul>

        {/* ── Actions desktop ── */}
        <div className={styles.actions}>
          {user ? (
            <>
              <span className={styles.userBadge}>
                {user.prenom?.[0]}{user.nom?.[0]}
              </span>
              <span className={styles.userName}>{user.prenom}</span>
              <button onClick={handleLogout} className={styles.btnOutline}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion"  className={styles.btnOutline}>Connexion</NavLink>
              <NavLink to="/inscription" className={styles.btnPrimary}>Inscription</NavLink>
            </>
          )}
        </div>

        {/* ── Burger mobile / tablette ── */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineTop : ''}`}/>
          <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineMiddle : ''}`}/>
          <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineBottom : ''}`}/>
        </button>
      </nav>

      {/* ── Menu mobile / tablette ── */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Menu mobile">
          <ul className={styles.mobileLinks} role="list">
            <li>
              <NavLink to="/recherche" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                🔍 Rechercher
              </NavLink>
            </li>
            
              <li>
            <NavLink to="/recherche" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
             💻 Professionnels
            </NavLink>
            </li>
            <li>
           <NavLink to="/entreprises" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            🏢 Entreprises
          </NavLink>
          </li>
            {user && (
              <li>
                <NavLink to="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                  📊 Mon espace
                </NavLink>
              </li>
            )}
            <li className={styles.mobileLinkDivider}>
              {user ? (
                <button onClick={handleLogout} className={styles.mobileLink}>
                  🚪 Déconnexion
                </button>
              ) : (
                <>
                  <NavLink to="/connexion"   className={styles.mobileLink} onClick={() => setMenuOpen(false)}>🔑 Connexion</NavLink>
                  <NavLink to="/inscription" className={`${styles.mobileLink} ${styles.mobileLinkAccent}`} onClick={() => setMenuOpen(false)}>✨ Inscription</NavLink>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
