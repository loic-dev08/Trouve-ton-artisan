//src/Navbar.jsx/

import stles from './Navbar.module.css';

export default function Navbar() { 
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>Trouve ton Artisan</div>
            <ul className={styles.navLinks}>
                <li><a href="/">Accueil</a></li>
                <li><a href="/artisans">Artisans</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
}