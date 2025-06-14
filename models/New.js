const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const New = sequelize.define('New', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { // Título de la noticia
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: { // Nota o descripción personalizada del usuario
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'news',
  timestamps: true,
});

// Modelo para favoritos de assets (si no existe en models/FavoriteAsset.js)
const FavoriteAsset = sequelize.define('FavoriteAsset', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  symbol: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'favorite_assets',
  timestamps: true,
});

module.exports = { New, FavoriteAsset };
