import { NavLink } from 'react-router-dom';

/**
 * Footer — présent et identique sur toutes les pages.
 * Contient les liens légaux et les coordonnées de Lyon.
 */
function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="row gy-4">

          {/* Coordonnées antenne de Lyon */}
          <div className="col-12 col-md-6">
            <h2 className="footer-heading">Région Auvergne-Rhône-Alpes</h2>
            <address className="footer-address">
              101 cours Charlemagne<br />
              CS 20033<br />
              69269 LYON CEDEX 02<br />
              France
            </address>
            <p className="footer-phone">
              <a href="tel:+33426734000" aria-label="Téléphone : plus 33 4 26 73 40 00">
                +33 (0)4 26 73 40 00
              </a>
            </p>
          </div>

          {/* Liens légaux */}
          <div className="col-12 col-md-6">
            <h2 className="footer-heading">Informations légales</h2>
            <nav aria-label="Liens légaux">
              <ul className="footer-legal-links list-unstyled">
                <li><NavLink to="/mentions-legales">Mentions légales</NavLink></li>
                <li><NavLink to="/donnees-personnelles">Données personnelles</NavLink></li>
                <li><NavLink to="/accessibilite">Accessibilité</NavLink></li>
                <li><NavLink to="/cookies">Cookies</NavLink></li>
              </ul>
            </nav>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Région Auvergne-Rhône-Alpes. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
