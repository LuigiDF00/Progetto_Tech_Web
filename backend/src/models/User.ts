import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db/database';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url?: string | null;
  created_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar_url' | 'created_at'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public declare id: number;
  public declare username: string;
  public declare email: string;
  public declare password_hash: string;
  public declare avatar_url: string | null;
  public readonly declare created_at: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default User;
