import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/database';

export interface AttemptAttributes {
  id: number;
  user_id: number;
  riddle_id: number;
  proposed_regex: string;
  pos_passed_count: number;
  neg_passed_count: number;
  total_pos_count: number;
  total_neg_count: number;
  is_solved: number;
  created_at?: Date;
}

export interface AttemptCreationAttributes extends Optional<AttemptAttributes, 'id' | 'created_at'> {}

export class Attempt extends Model<AttemptAttributes, AttemptCreationAttributes> implements AttemptAttributes {
  public declare id: number;
  public declare user_id: number;
  public declare riddle_id: number;
  public declare proposed_regex: string;
  public declare pos_passed_count: number;
  public declare neg_passed_count: number;
  public declare total_pos_count: number;
  public declare total_neg_count: number;
  public declare is_solved: number;
  public readonly declare created_at: Date;
}

Attempt.init({
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
  sequelize,
  tableName: 'attempts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Attempt;
