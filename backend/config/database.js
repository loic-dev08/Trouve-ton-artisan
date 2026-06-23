// Configuration de la connexion à la base de données via Sequelize
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Désactiver les logs SQL en production
    define: {
      timestamps: true,         // created_at / updated_at automatiques
      underscored: true,        // snake_case pour les colonnes
      freezeTableName: false,   // Sequelize pluralise les noms de table
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
