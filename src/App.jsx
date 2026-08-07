import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home              from './pages/Home'
import Search            from './pages/Search'
import ProProfil         from './pages/ProProfil'
import Register          from './pages/Inscription'
import Login             from './pages/Connexion'
import Dashboard         from './pages/Dashboard'
import ProDemandes       from './pages/ProDemandes'
import ProfilUtilisateur from './pages/ProfilUtilisateur'
import ProtectedRoute    from './components/ProtectedRoute'
import NotFound          from './pages/NotFound'
import MesDemandes from './pages/MesDemandes'
import Entreprises from './pages/Entreprises'
import EntrepriseProfil from './pages/EntrepriseProfil'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Pages publiques ── */}
        <Route path="/"            element={<Home />} />
        <Route path="/recherche"   element={<Search />} />
        <Route path="/pro/:id"     element={<ProProfil />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/connexion"   element={<Login />} />
        <Route path="/entreprises" element={<Entreprises />} />
        <Route path="/entreprise/:id" element={<EntrepriseProfil />} />

        {/* ── Pages privées (nécessitent d'être connecté) ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"          element={<Dashboard />} />
          <Route path="/dashboard/demandes" element={<ProDemandes />} />
          <Route path="/dashboard/mes-demandes" element={<MesDemandes />} />
          <Route path="/dashboard/profil"   element={<ProfilUtilisateur />} />
        </Route>

        {/* ── Page 404 ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App