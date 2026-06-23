import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound — page 404.
 * S'affiche pour toute URL non reconnue grâce au wildcard "*" dans App.jsx.
 */
function NotFound() {
  useEffect(() => {
    document.title = 'Page introuvable | Trouve ton artisan';
  }, []);

  return (
    <div className="not-found container py-5 text-center">
      {/* Illustration SVG inline */}
      <div className="not-found__illustration" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="220" height="176">
          <rect width="200" height="160" rx="12" fill="#f0f4f8"/>
          <text x="100" y="90" textAnchor="middle" fontSize="72" fontWeight="bold" fill="#2D4A6B" opacity=".15">404</text>
          <text x="100" y="88" textAnchor="middle" fontSize="64" fontWeight="bold" fill="#2D4A6B">🔧</text>
        </svg>
      </div>

      <h1 className="not-found__title">Page introuvable</h1>
      <p className="not-found__message">
        La page que vous avez demandée n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn btn-primary not-found__btn">
        Retourner à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;
