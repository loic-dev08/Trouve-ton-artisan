import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getArtisans, getCategories } from "../services/artisans";
import ArtisanCard from "../components/artisan/ArtisanCard";
import useMetaBalise from "../hooks/useMetaBalise";
import "./ListeArtisans.scss";

export default function ListeArtisans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slugCategorie = searchParams.get("categorie") || "";
  const recherche = searchParams.get("recherche") || "";

  const [artisans, setArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    async function chargerDonnees() {
      try {
        setChargement(true);
        const [donneesArtisans, donneesCategories] = await Promise.all([
          getArtisans(),
          getCategories(),
        ]);
        setArtisans(donneesArtisans);
        setCategories(donneesCategories);
        setErreur(null);
      } catch (err) {
        console.error(err);
        setErreur("Impossible de charger les artisans pour le moment.");
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, []);

  const categorieActive = slugCategorie
    ? categories.find((c) => c.slug === slugCategorie)
    : null;

  useMetaBalise(
    categorieActive ? categorieActive.nom : "Tous les artisans",
    "Parcourez les artisans de la région Auvergne-Rhône-Alpes par catégorie et trouvez celui qu'il vous faut."
  );

  const resultats = useMemo(() => {
    return artisans.filter((artisan) => {
      const correspondCategorie = categorieActive
        ? artisan.categorie?.slug === categorieActive.slug
        : true;
      const correspondRecherche = recherche
        ? artisan.nom.toLowerCase().includes(recherche.toLowerCase())
        : true;
      return correspondCategorie && correspondRecherche;
    });
  }, [artisans, categorieActive, recherche]);

  function changerCategorie(slug) {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("categorie", slug);
    } else {
      params.delete("categorie");
    }
    setSearchParams(params);
  }

  return (
    <section className="liste-artisans">
      <div className="container-app px-3 px-md-4 py-4">
        <h1>
          {recherche
            ? `Résultats pour « ${recherche} »`
            : categorieActive
            ? categorieActive.nom
            : "Tous les artisans"}
        </h1>

        <div className="liste-artisans__filtres" role="group" aria-label="Filtrer par catégorie">
          <button
            type="button"
            className={!categorieActive ? "is-active" : ""}
            onClick={() => changerCategorie("")}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-${cat.slug} ${categorieActive?.slug === cat.slug ? "is-active" : ""}`}
              onClick={() => changerCategorie(cat.slug)}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {chargement ? (
          <p>Chargement des artisans...</p>
        ) : erreur ? (
          <p className="liste-artisans__vide">{erreur}</p>
        ) : resultats.length === 0 ? (
          <p className="liste-artisans__vide">
            Aucun artisan ne correspond à votre recherche pour le moment.
          </p>
        ) : (
          <div className="liste-artisans__grille">
            {resultats.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}