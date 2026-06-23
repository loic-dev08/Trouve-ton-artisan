import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header    from './components/Header.jsx';
import Footer    from './components/Footer.jsx';
import Home      from './pages/Home.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ArtisanPage  from './pages/ArtisanPage.jsx';
import LegalPage    from './pages/LegalPage.jsx';
import NotFound     from './pages/NotFound.jsx';

/**
 * App — Point d'entrée du routing React.
 * Le Header et le Footer sont partagés sur toutes les pages.
 * La page 404 (NotFound) est gérée par le wildcard "*".
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper d-flex flex-column min-vh-100">
        <Header />

        <main className="flex-grow-1">
          <Routes>
            {/* Page d'accueil */}
            <Route path="/"                   element={<Home />} />

            {/* Liste des artisans par catégorie */}
            <Route path="/categorie/:id"       element={<CategoryPage />} />

            {/* Résultats de recherche */}
            <Route path="/recherche"           element={<CategoryPage />} />

            {/* Fiche artisan */}
            <Route path="/artisan/:id"         element={<ArtisanPage />} />

            {/* Pages légales */}
            <Route path="/mentions-legales"    element={<LegalPage title="Mentions légales" />} />
            <Route path="/donnees-personnelles" element={<LegalPage title="Données personnelles" />} />
            <Route path="/accessibilite"       element={<LegalPage title="Accessibilité" />} />
            <Route path="/cookies"             element={<LegalPage title="Cookies" />} />

            {/* 404 pour toute autre URL */}
            <Route path="*"                    element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
