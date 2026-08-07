import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/database';

export interface ControlStringAttributes {
  id: number;
  riddle_id: number;
  string_value: string;
  is_positive: number;
}

export interface ControlStringCreationAttributes extends Optional<ControlStringAttributes, 'id'> {}

export class ControlString extends Model<ControlStringAttributes, ControlStringCreationAttributes> implements ControlStringAttributes {
  public declare id: number;
  public declare riddle_id: number;
  public declare string_value: string;
  public declare is_positive: number;
}

ControlString.init({
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
  sequelize,
  tableName: 'riddle_control_strings',
  timestamps: false
});

export default ControlString;
