import { useEffect } from "react";

/**
 * Définit le titre de l'onglet et la balise meta description de la page.
 * Répond à l'exigence de référencement du brief, sans dépendance externe.
 */
export default function useMetaBalise(titre, description) {
  useEffect(() => {
    document.title = titre ? `${titre} — Trouve ton artisan` : "Trouve ton artisan";

    let balise = document.querySelector('meta[name="description"]');
    if (!balise) {
      balise = document.createElement("meta");
      balise.setAttribute("name", "description");
      document.head.appendChild(balise);
    }
    if (description) {
      balise.setAttribute("content", description);
    }
  }, [titre, description]);
}
