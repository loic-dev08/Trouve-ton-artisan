// Routes pour les catégories d'artisans
const express  = require('express');
const router   = express.Router();
const { Category, Specialty } = require('../models');

/**
 * GET /api/categories
 * Retourne toutes les catégories (pour alimenter le menu de navigation)
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['nom', 'ASC']],
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Erreur GET /categories :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

/**
 * GET /api/categories/:id
 * Retourne une catégorie avec ses spécialités
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validation de l'id
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'ID invalide.' });
    }

    const category = await Category.findByPk(id, {
      include: [{ model: Specialty, as: 'specialites' }],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Catégorie introuvable.' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Erreur GET /categories/:id :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
