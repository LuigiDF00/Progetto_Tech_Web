const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Attempt = sequelize.define('Attempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  riddle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  proposed_regex: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pos_passed_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  neg_passed_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_pos_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_neg_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_solved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[0, 1]]
    }
  }
}, {
  tableName: 'attempts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Attempt;
