const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Riddle = sequelize.define('Riddle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  secret_regex: {
    type: DataTypes.STRING,
    allowNull: false
  },
  public_pos_example: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  public_neg_example: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'riddles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Riddle;
