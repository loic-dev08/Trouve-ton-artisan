// Modèle Sequelize pour la table des artisans
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Artisan = sequelize.define('Artisan', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  specialite_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  note: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  ville: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  site_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  a_propos: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  top: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'artisans',
});

module.exports = Artisan;
