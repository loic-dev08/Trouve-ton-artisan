import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * LegalPage — page légale vide en attente de contenu.
 * Le header et le footer restent affichés.
 * @param {string} title — titre de la page (ex : "Mentions légales")
 */
function LegalPage({ title }) {
  useEffect(() => {
    document.title = `${title} | Trouve ton artisan`;
  }, [title]);

  return (
    <div className="legal-page container py-5">
      <h1>{title}</h1>
      <p className="legal-placeholder">
        Page en construction. Le contenu sera ajouté prochainement par notre équipe juridique.
      </p>
      <Link to="/" className="btn btn-primary mt-3">Retour à l'accueil</Link>
    </div>
  );
}

export default LegalPage;
