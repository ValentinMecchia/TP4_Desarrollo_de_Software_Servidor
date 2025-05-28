const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('Asset', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ticker: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'assets',
  timestamps: true,
});

module.exports = User;
