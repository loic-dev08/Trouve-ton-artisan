import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';

/**
 * ArtisanCard — fiche résumée d'un artisan.
 * Cliquable, renvoie vers la fiche complète /artisan/:id.
 */
function ArtisanCard({ artisan }) {
  const { id, nom, note, ville, specialite } = artisan;
  const specialiteNom = specialite?.nom || '—';

  return (
    <article className="artisan-card">
      <Link
        to={`/artisan/${id}`}
        className="artisan-card__link"
        aria-label={`Voir la fiche de ${nom}`}
      >
        {/* Icône / initiales */}
        <div className="artisan-card__avatar" aria-hidden="true">
          {nom.charAt(0).toUpperCase()}
        </div>

        <div className="artisan-card__body">
          <h3 className="artisan-card__name">{nom}</h3>

          <p className="artisan-card__specialty">
            <span className="visually-hidden">Spécialité : </span>
            {specialiteNom}
          </p>

          <StarRating note={parseFloat(note)} />

          <p className="artisan-card__location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            <span className="visually-hidden">Ville : </span>
            {ville}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default ArtisanCard;
