import { useEffect, useState } from 'react';
import ArtisanCard from '../components/ArtisanCard.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Page d'accueil — Hero + "Comment trouver mon artisan ?" + Artisans du mois
 */
function Home() {
  const [topArtisans, setTopArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement des artisans du mois (top=1)
  useEffect(() => {
    document.title = 'Trouve ton artisan ! | Auvergne-Rhône-Alpes';

    fetch(`${API_URL}/artisans?top=1`, {
      headers: { 'x-api-key': API_KEY },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setTopArtisans(json.data);
        else setError('Impossible de charger les artisans du mois.');
      })
      .catch(() => setError('Erreur de connexion au serveur.'))
      .finally(() => setLoading(false));
  }, []);

  // Étapes du parcours utilisateur
  const steps = [
    {
      num: '01',
      title: 'Choisir une catégorie',
      text: 'Sélectionnez la catégorie d'artisanat qui correspond à votre besoin dans le menu de navigation.',
    },
    {
      num: '02',
      title: 'Choisir un artisan',
      text: 'Parcourez la liste des artisans disponibles et consultez leur fiche détaillée.',
    },
    {
      num: '03',
      title: 'Le contacter',
      text: 'Envoyez votre demande directement à l'artisan via le formulaire de contact présent sur sa fiche.',
    },
    {
      num: '04',
      title: 'Recevoir une réponse',
      text: 'L'artisan vous répondra sous 48 heures avec les informations demandées.',
    },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero__content">
            <p className="hero__eyebrow">Région Auvergne-Rhône-Alpes</p>
            <h1 id="hero-title" className="hero__title">
              Trouve ton artisan&nbsp;!
            </h1>
            <p className="hero__subtitle">
              Plus de 221 000 artisans dans la région. Trouvez le bon professionnel
              près de chez vous et contactez-le en quelques clics.
            </p>
          </div>
        </div>
      </section>

      {/* ── Comment trouver mon artisan ? ────────────────────────────────── */}
      <section className="how-to" aria-labelledby="how-to-title">
        <div className="container">
          <h2 id="how-to-title" className="section-title">
            Comment trouver mon artisan&nbsp;?
          </h2>

          <ol className="how-to__steps" aria-label="Étapes pour trouver un artisan">
            {steps.map((step) => (
              <li key={step.num} className="how-to__step">
                <span className="how-to__num" aria-hidden="true">{step.num}</span>
                <div className="how-to__text">
                  <h3 className="how-to__step-title">{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Artisans du mois ─────────────────────────────────────────────── */}
      <section className="top-artisans" aria-labelledby="top-title">
        <div className="container">
          <h2 id="top-title" className="section-title">
            Les artisans du mois
          </h2>

          {loading && (
            <div className="text-center py-5" role="status" aria-live="polite">
              <div className="spinner-border text-primary" aria-hidden="true"></div>
              <p className="mt-2">Chargement en cours…</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">{error}</div>
          )}

          {!loading && !error && topArtisans.length === 0 && (
            <p className="text-center text-muted">Aucun artisan du mois pour le moment.</p>
          )}

          {!loading && !error && topArtisans.length > 0 && (
            <div className="artisan-grid">
              {topArtisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
