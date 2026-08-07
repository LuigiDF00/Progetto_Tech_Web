const sequelize = require('../db/database');
const User = require('./User');
const Riddle = require('./Riddle');
const ControlString = require('./ControlString');
const Attempt = require('./Attempt');

// Definizione delle Associazioni tra Modelli

// User <-> Riddle (Un utente crea molti enigmi)
User.hasMany(Riddle, { foreignKey: 'author_id', as: 'riddles', onDelete: 'CASCADE' });
Riddle.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Riddle <-> ControlString (Un enigma ha molte stringhe di controllo segrete)
Riddle.hasMany(ControlString, { foreignKey: 'riddle_id', as: 'control_strings', onDelete: 'CASCADE' });
ControlString.belongsTo(Riddle, { foreignKey: 'riddle_id', as: 'riddle' });

// User <-> Attempt (Un utente compie molti tentativi)
User.hasMany(Attempt, { foreignKey: 'user_id', as: 'attempts', onDelete: 'CASCADE' });
Attempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Riddle <-> Attempt (Un enigma riceve molti tentativi)
Riddle.hasMany(Attempt, { foreignKey: 'riddle_id', as: 'attempts', onDelete: 'CASCADE' });
Attempt.belongsTo(Riddle, { foreignKey: 'riddle_id', as: 'riddle' });

module.exports = {
  sequelize,
  User,
  Riddle,
  ControlString,
  Attempt
};
