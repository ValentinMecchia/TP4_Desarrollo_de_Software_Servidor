const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Portfolio = sequelize.define('Portfolio', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  performance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'portfolios',
  timestamps: true,
});

module.exports = Portfolio;
