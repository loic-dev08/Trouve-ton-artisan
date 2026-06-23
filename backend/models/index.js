// Point d'entrée des modèles — définit toutes les associations
const Category  = require('./Category');
const Specialty = require('./Specialty');
const Artisan   = require('./Artisan');

// Une catégorie a plusieurs spécialités
Category.hasMany(Specialty, { foreignKey: 'categorie_id', as: 'specialites' });
Specialty.belongsTo(Category, { foreignKey: 'categorie_id', as: 'categorie' });

// Une spécialité a plusieurs artisans
Specialty.hasMany(Artisan, { foreignKey: 'specialite_id', as: 'artisans' });
Artisan.belongsTo(Specialty, { foreignKey: 'specialite_id', as: 'specialite' });

module.exports = { Category, Specialty, Artisan };
