const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/regexriddle.db');

// Assicura che la cartella contenente il file del DB esista
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Abilita i vincoli di Foreign Key
db.pragma('foreign_keys = ON');

function initDb() {
  // Tabella Utenti
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabella Enigmi (Riddles)
  db.exec(`
    CREATE TABLE IF NOT EXISTS riddles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      secret_regex TEXT NOT NULL,
      public_pos_example TEXT NOT NULL,
      public_neg_example TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tabella Stringhe di Controllo Segrete per ciascun enigma
  db.exec(`
    CREATE TABLE IF NOT EXISTS riddle_control_strings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      riddle_id INTEGER NOT NULL,
      string_value TEXT NOT NULL,
      is_positive INTEGER NOT NULL CHECK(is_positive IN (0, 1)),
      FOREIGN KEY (riddle_id) REFERENCES riddles(id) ON DELETE CASCADE
    )
  `);

  // Tabella Tentativi di risoluzione
  db.exec(`
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      riddle_id INTEGER NOT NULL,
      proposed_regex TEXT NOT NULL,
      pos_passed_count INTEGER NOT NULL,
      neg_passed_count INTEGER NOT NULL,
      total_pos_count INTEGER NOT NULL,
      total_neg_count INTEGER NOT NULL,
      is_solved INTEGER NOT NULL CHECK(is_solved IN (0, 1)),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (riddle_id) REFERENCES riddles(id) ON DELETE CASCADE
    )
  `);
}

initDb();

module.exports = db;
