const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/regexriddle.db');

// Assicura che la cartella contenente la base di dati esista
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inizializza Sequelize con dialetto SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'test' ? false : console.log,
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;
