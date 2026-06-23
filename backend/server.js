/**
 * Serveur API - Trouve ton artisan
 * Node.js + Express + Sequelize + MySQL
 */
require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const sequelize   = require('./config/database');
const apiKeyAuth  = require('./middleware/apiKeyAuth');

// Import des routes
const categoriesRouter = require('./routes/categories');
const artisansRouter   = require('./routes/artisans');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Sécurité ────────────────────────────────────────────────────────────────

// Helmet : sécurise les en-têtes HTTP
app.use(helmet());

// CORS : autorise uniquement le frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));

// Rate limiting : 100 requêtes par 15 minutes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requêtes, veuillez réessayer plus tard.' },
});
app.use(limiter);

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Route de santé (pas de clé API nécessaire)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protection par clé API pour toutes les routes /api
app.use('/api', apiKeyAuth);

// Routeurs
app.use('/api/categories', categoriesRouter);
app.use('/api/artisans',   artisansRouter);

// Route 404 pour les endpoints inconnus
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint introuvable.' });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err);
  res.status(500).json({ success: false, message: 'Erreur serveur interne.' });
});

// ─── Connexion BDD puis démarrage ────────────────────────────────────────────

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connexion MySQL établie.');
    app.listen(PORT, () => {
      console.log(`🚀 API démarrée sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Impossible de se connecter à la BDD :', err.message);
    process.exit(1);
  });
