//src/component/Footer.jsx
import { Link } from "react-router-dom";
import "./Footer.scss";

const lienslégaux = [
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/donnees-personnelles", label: "Données personnelles" },
  { to: "/accessibilite", label: "Accessibilité" },
  { to: "/cookies", label: "Cookies" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className={`container-app  px-3 px-md-4 py-4`}>
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <p className="site-footer__title">Région Auvergne-Rhône-Alpes</p>
            <address>
              101 cours Charlemagne
              <br />
              CS 20033
              <br />
              69269 Lyon Cedex 02
              <br />
              France
              <br />
              <a href="tel:+33426734000">+33 (0)4 26 73 40 00</a>
            </address>
          </div>

          <div className="col-12 col-md-4">
            <p className="site-footer__title">Informations légales</p>
            <nav aria-label="Pages légales">
             <ul>
                {lienslégaux.map((lien) => (
                  <li key={lien.to}>
                    <Link to={lien.to}>
                      {lien.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-12 col-md-4"> 
            <p className="site-footer__title">Trouve ton artisan</p>  
            <p className="site-footer__baseline">
              Une plateforme de la région Auvergne-Rhône-Alpes pour mettre en relation
              particuliers et artisans de proximité.
            </p>
          </div>
        </div>

        <p className="site-footer__copy">
          © {new Date().getFullYear()} Région Auvergne-Rhône-Alpes — Tous droits réservés
        </p>  
      </div>
    </footer>
  );
}