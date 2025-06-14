const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Portfolio = sequelize.define('Portfolio', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  createdDate: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: () => new Date().toISOString().slice(0, 10),
  },
  performance: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  assets: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'portfolios',
  timestamps: true,
});

module.exports = Portfolio;