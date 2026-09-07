import { Link } from "react-router-dom";
import Etoiles from "../common/Etoiles";
import "./ArtisanCard.scss";

export default function ArtisanCard({ artisan }) {
  const categorie = artisan.categorie;
  const image = artisan.image || "/img/artisans/default.jpg";

  return (
    <Link
      to={`/artisan/${artisan.id}`}
      className={`artisan-card category-${categorie?.slug}`}
    >
      <div className="artisan-card__image">
        <img src={image} alt="" loading="lazy" />
      </div>
      <div className="artisan-card__body">
        <p className="artisan-card__categorie">{categorie?.nom}</p>
        <h3 className="artisan-card__nom">{artisan.nom}</h3>
        <p className="artisan-card__specialite">{artisan.specialite}</p>
        <Etoiles note={artisan.note} />
        <p className="artisan-card__ville">{artisan.ville}</p>
      </div>
    </Link>
  );
}