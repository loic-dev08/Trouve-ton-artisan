import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Import Bootstrap JS (pour les composants interactifs : navbar collapse…)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import des styles globaux (Bootstrap + Sass personnalisé)
import './styles/main.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
