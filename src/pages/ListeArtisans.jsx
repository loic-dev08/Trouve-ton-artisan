import { UseMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { artisans, categories, getCategorieBySlug, getCategorieOfArtisan } from "../data/mockData";
import ArtisanCard from "../components/artisan/ArtisanCard";
import useMetaBalise from "../hooks/useMetaBalise";
import "./ListeArtisans.scss";

export default function ListeArtisans() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categorieSlug = searchParams.get("categorie");
    const recherche = getCategorieBySlug("recherche") || "";

    const categorieActive = categorieSlug ? getCategorieBySlug(categorieSlug) : null;

    useMetaBalise(
        categorieActive ? categorieActive.nom : "Tous les artisans",
        "Parcourez les artisans de la région Auvergne-Rhône-Alpes par catégorie et trouvez celui qu'il vous faut."
    );

    const resultats = useMemo(() => {
        return artisans.filter((artisan) => {
            const correspondCategorie = categorieActive 
                ? getCategorieOfArtisan(artisan)?.slug === categorieActive.slug
                : true;
            const correspondRecherche = recherche   
            ? artisan.nom.toLowerCase().includes(recherche.toLowerCase())
            : true;
            return correspondCategorie && correspondRecherche;
        });
    }, [categorieActive, recherche]);

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
                            className={categorieActive?.slug === cat.slug ? "is-active" : ""}
                            onClick={() => changerCategorie(cat.slug)}
                        >
                            {cat.nom}
                        </button>
                    ))}
                </div>

                {resultats.length === 0 ? (
                    <p className="Listes_artisans__vide">
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