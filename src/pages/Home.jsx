import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArtisans, getCategories } from "../services/artisans";
import ArtisanCard from "../components/artisan/ArtisanCard";
import useMetaBalise from "../hooks/useMetaBalise";
import "./Home.scss";

const etapes = [
  {
    numero: 1,
    titre: "Choisissez la catégorie d'artisanat",
    texte: "Bâtiment, services, fabrication ou alimentation : parcourez le menu pour trouver le bon métier.",
  },
  {
    numero: 2,
    titre: "Choisissez un artisan",
    texte: "Consultez les fiches, comparez les avis et repérez celui qui vous correspond, près de chez vous.",
  },
  {
    numero: 3,
    titre: "Contactez-le via le formulaire",
    texte: "Décrivez votre besoin directement depuis sa fiche, en quelques champs seulement.",
  },
  {
    numero: 4,
    titre: "Recevez une réponse sous 48h",
    texte: "L'artisan revient vers vous rapidement pour discuter de votre projet.",
  },
];

export default function Home() {
  useMetaBalise(
    "Accueil",
    "Trouvez un artisan de la région Auvergne-Rhône-Alpes en quelques clics : bâtiment, services, fabrication, alimentation."
  );

  const [categories, setCategories] = useState([]);
  const [artisansDuMois, setArtisansDuMois] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function chargerDonnees() {
      try {
        setChargement(true);
        const [donneesCategories, donneesArtisansTop] = await Promise.all([
          getCategories(),
          getArtisans({ top: true }),
        ]);
        setCategories(donneesCategories);
        setArtisansDuMois(donneesArtisansTop.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, []);

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
                  {cat.nom}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="etapes" aria-labelledby="etapes-titre">
        <div className="container-app px-3 px-md-4">
          <h2 id="etapes-titre">Comment trouver mon artisan ?</h2>
          <ol className="etapes__liste">
            {etapes.map((etape) => (
              <li key={etape.numero}>
                <span className="etapes__numero" aria-hidden="true">
                  {etape.numero}
                </span>
                <h3>{etape.titre}</h3>
                <p>{etape.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="artisans-du-mois" aria-labelledby="artisans-mois-titre">
        <div className="container-app px-3 px-md-4">
          <h2 id="artisans-mois-titre">Les artisans du mois</h2>
          {chargement ? (
            <p>Chargement...</p>
          ) : (
            <div className="artisans-du-mois__grille">
              {artisansDuMois.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}