const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const New = sequelize.define('New', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'news',
  timestamps: true,
});

module.exports = New;
