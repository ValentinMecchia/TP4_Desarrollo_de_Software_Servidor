const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Investment = sequelize.define('Investment', {
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  buyDate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'investments',
  timestamps: true,
});

module.exports = Investment;
