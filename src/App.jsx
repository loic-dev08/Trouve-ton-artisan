import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import ListeArtisans from "./pages/ListeArtisans";
import FicheArtisan from "./pages/FicheArtisan";
import NotFound from "./pages/NotFound";
import PageEnConstruction from "./pages/legal/PageEnConstruction";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artisans" element={<ListeArtisans />} />
        <Route path="/artisan/:id" element={<FicheArtisan />} />

        <Route path="/mentions-legales" element={<PageEnConstruction titre="Mentions légales" />} />
        <Route path="/donnees-personnelles" element={<PageEnConstruction titre="Données personnelles" />} />
        <Route path="/accessibilite" element={<PageEnConstruction titre="Accessibilité" />} />
        <Route path="/cookies" element={<PageEnConstruction titre="Cookies" />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
