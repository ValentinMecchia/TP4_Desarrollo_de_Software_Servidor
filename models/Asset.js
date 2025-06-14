const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Modelo principal de Asset (si no existe)
const Asset = sequelize.define('Asset', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  ticker: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: 'assets',
  timestamps: true,
});

// Modelo para favoritos de assets
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

module.exports = {
  Asset,
  FavoriteAsset
};
