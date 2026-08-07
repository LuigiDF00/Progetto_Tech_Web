import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/database';
import User from './User';
import Attempt from './Attempt';

export interface RiddleAttributes {
  id: number;
  author_id: number;
  title: string;
  description: string;
  secret_regex: string;
  public_pos_example: string;
  public_neg_example: string;
  created_at?: Date;
}

export interface RiddleCreationAttributes extends Optional<RiddleAttributes, 'id' | 'created_at'> {}

export class Riddle extends Model<RiddleAttributes, RiddleCreationAttributes> implements RiddleAttributes {
  public declare id: number;
  public declare author_id: number;
  public declare title: string;
  public declare description: string;
  public declare secret_regex: string;
  public declare public_pos_example: string;
  public declare public_neg_example: string;
  public readonly declare created_at: Date;

  public declare author?: User;
  public declare attempts?: Attempt[];
}

Riddle.init({
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
  sequelize,
  tableName: 'riddles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Riddle;
