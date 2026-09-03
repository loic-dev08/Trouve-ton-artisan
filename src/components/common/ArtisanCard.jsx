import { Link } from "react-router-dom";
import Etoiles from"../Etoiles";
import { getCategorieOfArtisan, getSpecialite } from "../../data/mockData";
import "./ArtisanCard.scss";

export default function ArtisanCard({ artisan }) {
  const categorie = getCategorieOfArtisan(artisan);
  const specialite = getSpecialite(artisan.specialiteId);

    return (
        <Link
            to={`/artisan/${artisan.id}`}
            className={`artisan-card category-${categorie?.slug}`}
        >
            <div className="artisan-card__image">
                <img src={artisan.image} alt="" loading="lazy" />
            </div>
            <div className="artisan-card__body">
                <p className="artisan-card__categorie">{categorie?.nom}</p>
                <h3 className="artisan-card__nom">{artisan.nom}</h3>
                <p className="artisan-card__specialite">{specialite?.nom}</p>
                <Etoiles note={artisan.note} />
                <p className="artisan-card__ville">{artisan.ville}</p>
            </div>
        </Link>
    );
}