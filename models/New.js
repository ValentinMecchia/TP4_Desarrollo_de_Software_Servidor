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

module.exports = { New };
