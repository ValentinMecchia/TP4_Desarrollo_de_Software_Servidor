const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const PriceHistory = sequelize.define('PriceHistory', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'price_history',
  timestamps: true,
});

module.exports = PriceHistory;
