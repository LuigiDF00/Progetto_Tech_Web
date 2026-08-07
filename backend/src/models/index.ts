import sequelize from '../db/database';
import User from './User';
import Riddle from './Riddle';
import ControlString from './ControlString';
import Attempt from './Attempt';

// Definizione delle Associazioni tra Modelli

User.hasMany(Riddle, { foreignKey: 'author_id', as: 'riddles', onDelete: 'CASCADE' });
Riddle.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Riddle.hasMany(ControlString, { foreignKey: 'riddle_id', as: 'control_strings', onDelete: 'CASCADE' });
ControlString.belongsTo(Riddle, { foreignKey: 'riddle_id', as: 'riddle' });

User.hasMany(Attempt, { foreignKey: 'user_id', as: 'attempts', onDelete: 'CASCADE' });
Attempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Riddle.hasMany(Attempt, { foreignKey: 'riddle_id', as: 'attempts', onDelete: 'CASCADE' });
Attempt.belongsTo(Riddle, { foreignKey: 'riddle_id', as: 'riddle' });

export {
  sequelize,
  User,
  Riddle,
  ControlString,
  Attempt
};
