// Middleware de sécurité : vérifie la clé API dans l'en-tête x-api-key
// Limite l'accès à l'API aux seules applications autorisées.
require('dotenv').config();

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé : clé API manquante.',
    });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé : clé API invalide.',
    });
  }

  next();
};

module.exports = apiKeyAuth;
