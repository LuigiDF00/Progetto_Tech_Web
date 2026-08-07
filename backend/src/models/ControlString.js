const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const ControlString = sequelize.define('ControlString', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  riddle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  string_value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_positive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[0, 1]]
    }
  }
}, {
  tableName: 'riddle_control_strings',
  timestamps: false
});

module.exports = ControlString;
