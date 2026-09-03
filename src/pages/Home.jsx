import { Link } from "react-router-dom";
import { categories, artisans } from "../data/mockData";
import ArtisanCard from "../components/artisan/ArtisanCard";
import useMetaBalise from "../hooks/useMetaBalise";
import "./Home.scss";   

const etapes = [
  {
    numero: 1,  
    titre : "Choisissez la catégorie d'artisanat",
    texte : "Bâtiment, services, fabrication ou alimentation : parcourez le menu pour trouver le bon métier.",
  },
    {
        numero: 2,
        titre: "Choisissez un artisan",
        texte: "Consultez les fiches, comparez les avis et repérez celui qui vous correspond, près de chez vous."
    },
    {
        numero: 3,
        titre: "Contactez-le via le formulaire",
        texte: "Décrivez votre besoin directement depuis sa fiche, en quelques champs seulement."
    },
    {
        numero: 4,
        titre: "Recevez une réponse sous 48h",
        texte: "L'artisan revient vers vous rapidement pour discuter de votre projet."
    }
];

export default function Home() {
    useMetaBalise(
        "Accueil",
        "Trouvez un artisan de la région Auvergne-Rhône-Alpes en quelques clics : bâtiment, services, fabrication, alimentation."
    );
    const artisansDuMois = artisans.filter((a) => a.artisanDuMois).slice(0, 3);

    return (
        <>
            <section className="hero">
                <div className="container-app px-3 px-md-4">
                    <p className="hero__eyebrow">Région Auvergne-Rhône-Alpes</p>
                    <h1>Trouvez l'artisan qu'il vous faut, près de chez vous</h1>
                    <p className="hero__intro">
                        Bâtiment, services, fabrication, alimentation : des milliers d'artisans de la région
                        vous attendent. Décrivez votre besoin, ils vous répondent sous 48h.
                    </p>

                    <ul className="hero__categories">
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <Link to={`/artisans?categorie=${cat.slug}`} className={`category-${cat.slug}`}>
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="etapes" aria-labelledby="etapes-titre"> 
                <div className="container-app px-3 px-md-4">
                    <h2 id="etapes-titre">Comment trouver mon artisan ?</h2>
                    <ol className="etapes__list">
                        {etapes.map((etape) => (
                            <li key={etape.numero}>
                                <h3>{etape.titre}</h3>
                                <p>{etape.texte}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="artisans-du-mois" aria-labelledby="artisans-du-mois-titre">
                <div className="container-app px-3 px-md-4">
                    <h2 id="artisans-du-mois-titre">Les artisans du mois</h2>
                    <div className="artisans-du-mois__grille">
                        {artisansDuMois.map((artisan) => (
                            <ArtisanCard key={artisan.id} artisan={artisan} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}