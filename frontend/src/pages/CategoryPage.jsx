import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import ArtisanCard from '../components/ArtisanCard.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * CategoryPage — liste des artisans filtrés par catégorie ou par recherche.
 * Utilisée pour /categorie/:id et /recherche?search=…
 */
function CategoryPage() {
  const { id: categoryId }     = useParams();
  const [searchParams]         = useSearchParams();
  const location               = useLocation();
  const searchTerm             = searchParams.get('search') || '';

  const [artisans, setArtisans]       = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Construction de l'URL selon le contexte (catégorie ou recherche)
    const params = new URLSearchParams();
    if (categoryId)  params.append('categorie', categoryId);
    if (searchTerm)  params.append('search', searchTerm);

    // Si on est sur la page catégorie, on charge aussi le nom de la catégorie
    const fetchCategory = categoryId
      ? fetch(`${API_URL}/categories/${categoryId}`, {
          headers: { 'x-api-key': API_KEY },
        }).then((r) => r.json())
      : Promise.resolve(null);

    const fetchArtisans = fetch(`${API_URL}/artisans?${params.toString()}`, {
      headers: { 'x-api-key': API_KEY },
    }).then((r) => r.json());

    Promise.all([fetchArtisans, fetchCategory])
      .then(([artisansJson, categoryJson]) => {
        if (artisansJson.success) setArtisans(artisansJson.data);
        else setError('Impossible de charger les artisans.');

        if (categoryJson?.success) setCategoryName(categoryJson.data.nom);
      })
      .catch(() => setError('Erreur de connexion au serveur.'))
      .finally(() => setLoading(false));
  }, [categoryId, searchTerm, location.pathname]);

  // Titre de la page selon le contexte
  const pageTitle = searchTerm
    ? `Résultats pour "${searchTerm}"`
    : categoryName
    ? `Artisans — ${categoryName}`
    : 'Artisans';

  // SEO
  useEffect(() => {
    document.title = `${pageTitle} | Trouve ton artisan`;
  }, [pageTitle]);

  return (
    <section className="category-page" aria-labelledby="category-title">
      <div className="container py-5">
        <h1 id="category-title" className="page-title">{pageTitle}</h1>

        {loading && (
          <div className="text-center py-5" role="status" aria-live="polite">
            <div className="spinner-border text-primary" aria-hidden="true"></div>
            <p className="mt-2">Chargement en cours…</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">{error}</div>
        )}

        {!loading && !error && artisans.length === 0 && (
          <p className="text-muted text-center mt-4">
            Aucun artisan trouvé pour cette recherche.
          </p>
        )}

        {!loading && !error && artisans.length > 0 && (
          <>
            <p className="results-count" aria-live="polite">
              {artisans.length} artisan{artisans.length > 1 ? 's' : ''} trouvé{artisans.length > 1 ? 's' : ''}
            </p>
            <div className="artisan-grid">
              {artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CategoryPage;
