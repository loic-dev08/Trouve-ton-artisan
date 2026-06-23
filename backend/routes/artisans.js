// Routes pour les artisans
const express  = require('express');
const router   = express.Router();
const { Op }   = require('sequelize');
const { Artisan, Specialty, Category } = require('../models');

// Inclusion commune Sequelize (évite la répétition)
const includeSpecialtyCategory = [
  {
    model: Specialty,
    as: 'specialite',
    include: [{ model: Category, as: 'categorie' }],
  },
];

/**
 * GET /api/artisans
 * Paramètres optionnels :
 *   - search     : recherche sur le nom de l'artisan
 *   - categorie  : id de la catégorie (filtre)
 *   - top        : 1 pour récupérer uniquement les artisans du mois
 */
router.get('/', async (req, res) => {
  try {
    const { search, categorie, top } = req.query;
    const where = {};
    const specialiteWhere = {};

    // Recherche par nom d'artisan (insensible à la casse)
    if (search && search.trim() !== '') {
      // Sanitisation basique : on accepte seulement les caractères alphanumériques et espaces
      const safeSearch = search.trim().replace(/[^a-zA-Z0-9\s\-'éèêëàâùûüîïôçœæÉÈÊËÀÂÙÛÜÎÏÔÇŒÆ]/g, '');
      if (safeSearch.length > 0) {
        where.nom = { [Op.like]: `%${safeSearch}%` };
      }
    }

    // Filtre par catégorie via la spécialité
    if (categorie && !isNaN(categorie)) {
      specialiteWhere.categorie_id = parseInt(categorie, 10);
    }

    // Filtre artisans du mois
    if (top === '1') {
      where.top = true;
    }

    const artisans = await Artisan.findAll({
      where,
      include: [
        {
          model: Specialty,
          as: 'specialite',
          where: Object.keys(specialiteWhere).length ? specialiteWhere : undefined,
          include: [{ model: Category, as: 'categorie' }],
        },
      ],
      order: [['note', 'DESC']],
    });

    res.json({ success: true, data: artisans });
  } catch (error) {
    console.error('Erreur GET /artisans :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

/**
 * GET /api/artisans/:id
 * Retourne la fiche complète d'un artisan
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'ID invalide.' });
    }

    const artisan = await Artisan.findByPk(id, {
      include: includeSpecialtyCategory,
    });

    if (!artisan) {
      return res.status(404).json({ success: false, message: 'Artisan introuvable.' });
    }

    res.json({ success: true, data: artisan });
  } catch (error) {
    console.error('Erreur GET /artisans/:id :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
