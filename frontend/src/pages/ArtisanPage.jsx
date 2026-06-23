import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * ArtisanPage — fiche complète d'un artisan avec formulaire de contact.
 */
function ArtisanPage() {
  const { id } = useParams();

  const [artisan, setArtisan]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Formulaire de contact
  const [form, setForm]     = useState({ nom: '', email: '', objet: '', message: '' });
  const [formMsg, setFormMsg] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/artisans/${id}`, {
      headers: { 'x-api-key': API_KEY },
    })
      .then((res) => {
        if (res.status === 404) throw new Error('not_found');
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setArtisan(json.data);
          document.title = `${json.data.nom} | Trouve ton artisan`;
        } else {
          setError('Artisan introuvable.');
        }
      })
      .catch((err) => {
        setError(err.message === 'not_found' ? 'Artisan introuvable.' : 'Erreur de connexion.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Mise à jour du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire (mailto: côté client — à remplacer par un endpoint /api/contact)
  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Validation basique côté client
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setFormMsg({ type: 'danger', text: 'Adresse e-mail invalide.' });
      setSending(false);
      return;
    }

    // Construction du lien mailto (solution sans serveur de mail)
    const subject  = encodeURIComponent(`[Trouve ton artisan] ${form.objet}`);
    const body     = encodeURIComponent(
      `Nom : ${form.nom}\nEmail : ${form.email}\n\nMessage :\n${form.message}`
    );
    window.location.href = `mailto:${artisan.email}?subject=${subject}&body=${body}`;

    setFormMsg({ type: 'success', text: 'Votre client mail va s'ouvrir pour envoyer votre message.' });
    setForm({ nom: '', email: '', objet: '', message: '' });
    setSending(false);
  };

  if (loading) return (
    <div className="container py-5 text-center" role="status" aria-live="polite">
      <div className="spinner-border text-primary" aria-hidden="true"></div>
      <p className="mt-2">Chargement de la fiche…</p>
    </div>
  );

  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger" role="alert">{error}</div>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </div>
  );

  const { nom, note, ville, a_propos, site_web, specialite } = artisan;

  return (
    <div className="artisan-page container py-5">

      {/* Fil d'Ariane */}
      <nav aria-label="Fil d'Ariane" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
          {specialite?.categorie && (
            <li className="breadcrumb-item">
              <Link to={`/categorie/${specialite.categorie.id}`}>
                {specialite.categorie.nom}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">{nom}</li>
        </ol>
      </nav>

      {/* En-tête fiche */}
      <div className="artisan-profile">
        <div className="artisan-profile__avatar" aria-hidden="true">
          {nom.charAt(0).toUpperCase()}
        </div>
        <div className="artisan-profile__info">
          <h1 className="artisan-profile__name">{nom}</h1>
          <p className="artisan-profile__specialty">
            {specialite?.nom || '—'}
            {specialite?.categorie && (
              <span className="artisan-profile__category">
                {' '}· {specialite.categorie.nom}
              </span>
            )}
          </p>
          <StarRating note={parseFloat(note)} />
          <p className="artisan-profile__location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            <span className="visually-hidden">Ville : </span>
            {ville}
          </p>
          {site_web && (
            <a
              href={site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="artisan-profile__website btn btn-outline-primary btn-sm"
            >
              Visiter le site web
              <span className="visually-hidden"> (s'ouvre dans un nouvel onglet)</span>
            </a>
          )}
        </div>
      </div>

      <div className="row mt-5 gy-5">
        {/* À propos */}
        <div className="col-12 col-lg-6">
          <section aria-labelledby="about-title">
            <h2 id="about-title" className="section-title--small">À propos</h2>
            <p className="artisan-about">
              {a_propos || 'Aucune description disponible pour le moment.'}
            </p>
          </section>
        </div>

        {/* Formulaire de contact */}
        <div className="col-12 col-lg-6">
          <section aria-labelledby="contact-title">
            <h2 id="contact-title" className="section-title--small">Contacter {nom}</h2>

            {formMsg && (
              <div
                className={`alert alert-${formMsg.type}`}
                role="alert"
                aria-live="polite"
              >
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="contact-form">

              <div className="mb-3">
                <label htmlFor="contact-nom" className="form-label">Votre nom <span aria-hidden="true">*</span></label>
                <input
                  id="contact-nom"
                  type="text"
                  name="nom"
                  className="form-control"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  aria-required="true"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="contact-email" className="form-label">Votre e-mail <span aria-hidden="true">*</span></label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  aria-required="true"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="contact-objet" className="form-label">Objet <span aria-hidden="true">*</span></label>
                <input
                  id="contact-objet"
                  type="text"
                  name="objet"
                  className="form-control"
                  value={form.objet}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  aria-required="true"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="contact-message" className="form-label">Message <span aria-hidden="true">*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-control"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  aria-required="true"
                />
              </div>

              <p className="form-text mb-3">
                <span aria-hidden="true">*</span> Champs obligatoires
              </p>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending}
              >
                {sending ? 'Envoi…' : 'Envoyer le message'}
              </button>

            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ArtisanPage;
