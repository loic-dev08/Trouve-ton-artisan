import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import SearchBar from './SearchBar.jsx';

const API_URL  = import.meta.env.VITE_API_URL  || '/api';
const API_KEY  = import.meta.env.VITE_API_KEY  || '';

/**
 * Header — présent et identique sur toutes les pages.
 * Le menu de catégories est chargé dynamiquement depuis l'API.
 */
function Header() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Chargement des catégories depuis l'API
  useEffect(() => {
    fetch(`${API_URL}/categories`, {
      headers: { 'x-api-key': API_KEY },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      })
      .catch((err) => console.error('Erreur chargement catégories :', err));
  }, []);

  // Gestion de la recherche
  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/recherche?search=${encodeURIComponent(term.trim())}`);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg" aria-label="Navigation principale">
        <div className="container">
          {/* Logo */}
          <NavLink className="navbar-brand" to="/" aria-label="Retour à l'accueil">
            <img src={Logo} alt="Trouve ton artisan – Auvergne-Rhône-Alpes" className="header-logo" />
          </NavLink>

          {/* Bouton hamburger mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Ouvrir le menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu + Barre de recherche */}
          <div className="collapse navbar-collapse" id="navbarMain">
            {/* Menu des catégories (alimenté depuis la BDD) */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {categories.map((cat) => (
                <li key={cat.id} className="nav-item">
                  <NavLink
                    to={`/categorie/${cat.id}`}
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    {cat.nom}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Barre de recherche */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
