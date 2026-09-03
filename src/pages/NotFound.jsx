import { Link } from "react-router-dom";
import useMetaBalise from "../hooks/useMetaBalise";
import "./NotFound.scss";

export default function NotFound() {
  useMetaBalise("Page non trouvée", "La page demandée n'existe pas.");
  return (
    <section className="not-found">
      <div className="container-app px-3 px-md-4 py-5 text-center">
        <img
            src="/img/illustration-404.svg"
            alt=""
            className="not-found__image"
            width="220"
            height="220"
        />
        <h1>Page non trouvée</h1>
        <p>
            La page que vous avez demandée n'existe pas ou a été déplacée. 
            Elle a peut-être changé d'adresse ou le lien que vous avez suivi est incorrect.
        </p>
        <Link to="/" className="not-found__lien">
            Retour à l'accueil
        </Link>
        </div>
    </section>
    );
}