const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Portfolio = sequelize.define('Portfolio', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
}, {
  tableName: 'portfolios',
  timestamps: true,
});

module.exports = Portfolio;