import { UseState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../../data/mockData";
import "./Header.scss";

export default function Header() {
  const [menuOuvert, setMenuOuvert] = UseState(false);
  const [recherche, setRecherche] = UseState("");
  const navigate = useNavigate();

  function soumettreRecherche(e) {
    e.preventDefault();
    const q = recherche.trim();
    if (q.length === 0) return;
    navigate(`/artisans?recherche=${encodeURIComponent(q)}`);
    setMenuOuvert(false);
  }

  return (
    <header className="site-header">
      <div className="container-app d-flex align-items-center justify-content-between py-2 px-3 px-md-4">
        <Link to="/" className="site-header__logo" aria-label="Trouve ton artisan — retour à l'accueil">
          <img src="/img/logo-trouve-ton-artisan.svg" alt="" width="44" height="44" />
          Trouve ton artisan
        </Link>
        <button
         type="button"
          className="site-header__burger d-lg-none"
          aria-expanded={menuOuvert}
          aria-controls="nav-principale"
          aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOuvert(!menuOuvert)}
        >

            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
        </button>

        <div id="nav-principale" className={`collapse ${menuOuvert ? "is-open" : ""}`}>
            <nav aria-label="Navigation principale">
            <ul className="site-header__nav">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/artisans?categorie=${cat.slug}`} onClick={() => setMenuOuvert(false)}>
                    {cat.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form className="site-header__search" role="search" onSubmit={soumettreRecherche}>
            <label htmlFor="recherche-artisan" className="visually-hidden">
              Rechercher un artisan par son nom
            </label>
            <input id="recherche-artisan" 
            type="search" placeholder="Rechercher un artisan…" 
            value={recherche} onChange={(e) => setRecherche(e.target.value)}
             />
             <button type="submit" aria-label="Lancer la recherche">
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <circle cx="8.5" cy="8.5" r="6"  fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
          </form>
        </div>
      </div>
    </header>
  );
}
