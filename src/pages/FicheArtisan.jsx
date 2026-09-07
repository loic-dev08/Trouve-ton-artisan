import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { artisans, getCategorieOfArtisan, getSpecialite } from "../data/mockData";
import Etoiles from "../components/common/Etoiles";
import useMetaBalise from "../hooks/useMetaBalise";
import "./FicheArtisan.scss";

export default function FicheArtisan() {
  const { id } = useParams();
  const artisan = artisans.find((a) => String(a.id) === id);

  useMetaBalise(
    artisan ? artisan.nom : "Artisan introuvable",
    artisan ? artisan.aPropos : "Cette fiche artisan n'existe pas."
  );

  if (!artisan) {
    return (
      <section className="container-app px-3 px-md-4 py-5">
        <h1>Artisan introuvable</h1>
        <p>
          Cette fiche n'existe pas ou n'est plus disponible. <Link to="/artisans">Voir tous les artisans</Link>
        </p>
      </section>
    );
  }

  const categorie = getCategorieOfArtisan(artisan);
  const specialite = getSpecialite(artisan.specialiteId);

  return (
    <article className={`fiche-artisan category-${categorie?.slug}`}>
      <div className="container-app px-3 px-md-4 py-4">
        <nav aria-label="Fil d'Ariane" className="fiche-artisan__fil">
          <Link to="/">Accueil</Link> ›{" "}
          <Link to={`/artisans?categorie=${categorie?.slug}`}>{categorie?.nom}</Link> › {artisan.nom}
        </nav>

        <div className="fiche-artisan__entete">
          <img src={artisan.image} alt="" className="fiche-artisan__image" />
          <div>
            <p className="fiche-artisan__categorie">{categorie?.nom}</p>
            <h1>{artisan.nom}</h1>
            <p className="fiche-artisan__specialite">{specialite?.nom}</p>
            <Etoiles note={artisan.note} />
            <p className="fiche-artisan__ville">{artisan.ville}</p>
            {artisan.siteWeb && (
              <a href={artisan.siteWeb} target="_blank" rel="noopener noreferrer" className="fiche-artisan__site">
                Voir le site de l'artisan
              </a>
            )}
          </div>
        </div>

        <div className="fiche-artisan__contenu">
          <section aria-labelledby="a-propos-titre">
            <h2 id="a-propos-titre">À propos</h2>
            <p>{artisan.aPropos}</p>
          </section>

          <FormulaireContact artisan={artisan} />
        </div>
      </div>
    </article>
  );
}

function FormulaireContact({ artisan }) {
  const [champs, setChamps] = useState({ nom: "", email: "", objet: "", message: "" });
  const [erreurs, setErreurs] = useState({});
  const [statut, setStatut] = useState("idle"); // idle | envoi | succes | erreur

  function validerChamp(nom, valeur) {
    if (!valeur.trim()) return "Ce champ est obligatoire.";
    if (nom === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur)) {
      return "Merci de saisir une adresse e-mail valide.";
    }
    return "";
  }

  function gererChangement(e) {
    const { name, value } = e.target;
    setChamps((c) => ({ ...c, [name]: value }));
  }

  async function gererEnvoi(e) {
    e.preventDefault();
    const nouvellesErreurs = {};
    Object.entries(champs).forEach(([nom, valeur]) => {
      const err = validerChamp(nom, valeur);
      if (err) nouvellesErreurs[nom] = err;
    });
    setErreurs(nouvellesErreurs);
    if (Object.keys(nouvellesErreurs).length > 0) return;

    setStatut("envoi");
    try {
      // À brancher sur l'API : POST /api/artisans/:id/contact
      // await fetch(`/api/artisans/${artisan.id}/contact`, { method: "POST", body: JSON.stringify(champs), headers: {...} })
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatut("succes");
      setChamps({ nom: "", email: "", objet: "", message: "" });
    } catch {
      setStatut("erreur");
    }
  }

  return (
    <section aria-labelledby="contact-titre" className="fiche-artisan__contact">
      <h2 id="contact-titre">Contacter {artisan.nom}</h2>

      <form onSubmit={gererEnvoi} noValidate>
        <div className="champ">
          <label htmlFor="nom">
            Nom <span aria-hidden="true">*</span>
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            value={champs.nom}
            onChange={gererChangement}
            aria-invalid={Boolean(erreurs.nom)}
            aria-describedby={erreurs.nom ? "erreur-nom" : undefined}
            required
          />
          {erreurs.nom && (
            <p id="erreur-nom" className="champ__erreur">
              {erreurs.nom}
            </p>
          )}
        </div>

        <div className="champ">
          <label htmlFor="email">
            E-mail <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={champs.email}
            onChange={gererChangement}
            aria-invalid={Boolean(erreurs.email)}
            aria-describedby={erreurs.email ? "erreur-email" : undefined}
            required
          />
          {erreurs.email && (
            <p id="erreur-email" className="champ__erreur">
              {erreurs.email}
            </p>
          )}
        </div>

        <div className="champ">
          <label htmlFor="objet">
            Objet <span aria-hidden="true">*</span>
          </label>
          <input
            id="objet"
            name="objet"
            type="text"
            value={champs.objet}
            onChange={gererChangement}
            aria-invalid={Boolean(erreurs.objet)}
            aria-describedby={erreurs.objet ? "erreur-objet" : undefined}
            required
          />
          {erreurs.objet && (
            <p id="erreur-objet" className="champ__erreur">
              {erreurs.objet}
            </p>
          )}
        </div>

        <div className="champ">
          <label htmlFor="message">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={champs.message}
            onChange={gererChangement}
            aria-invalid={Boolean(erreurs.message)}
            aria-describedby={erreurs.message ? "erreur-message" : undefined}
            required
          />
          {erreurs.message && (
            <p id="erreur-message" className="champ__erreur">
              {erreurs.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={statut === "envoi"}>
          {statut === "envoi" ? "Envoi en cours…" : "Envoyer le message"}
        </button>

        <div aria-live="polite" className="fiche-artisan__statut">
          {statut === "succes" && <p className="fiche-artisan__succes">Votre message a bien été envoyé. Vous recevrez une réponse sous 48h.</p>}
          {statut === "erreur" && <p className="champ__erreur">Une erreur est survenue, merci de réessayer.</p>}
        </div>
      </form>
    </section>
  );
}
