const db = require('./database');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('🌱 Popolamento database con dati demo per la presentazione...');

  const passHash = bcrypt.hashSync('Password123!', 10);

  // Clear existing tables for fresh seed matching screenshot
  db.exec('DELETE FROM attempts');
  db.exec('DELETE FROM riddle_control_strings');
  db.exec('DELETE FROM riddles');
  db.exec('DELETE FROM users');

  // 1. Inserisci Utenti Demo
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, password_hash)
    VALUES (?, ?, ?, ?)
  `);

  insertUser.run(1, 'mario_dev', 'mario@regexriddle.it', passHash);
  insertUser.run(2, 'luigi_code', 'luigi@regexriddle.it', passHash);
  insertUser.run(3, 'peach_script', 'peach@regexriddle.it', passHash);
  insertUser.run(4, 'gigi', 'gigi@regexriddle.it', passHash);

  // 2. Inserisci Enigmi Demo (dallo screenshot del client)
  const insertRiddle = db.prepare(`
    INSERT INTO riddles (id, author_id, title, description, secret_regex, public_pos_example, public_neg_example)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertRiddle.run(
    1,
    1, // mario_dev
    'SOLO NUMERI DI 4 CIFRE',
    'Trova la regex che accetta esattamente 4 cifre numeriche.',
    '^[0-9]{4}$',
    '11234\n12336\n12345\n18789',
    '123'
  );

  insertRiddle.run(
    2,
    2, // luigi_code
    'MATCH EMAIL',
    'Scrivi una regex per validare indirizzi email comuni.',
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    'luig@email.com\nluigi@email.com\nluigiemail.com\nluigi@email.com',
    'luigiemail.com'
  );

  insertRiddle.run(
    3,
    3, // peach_script
    'HEX COLOR CODES',
    'Crea una regex per i codici colore esadecimali (#RRGGBB).',
    '^#[0-9a-fA-F]{6}$',
    '#833255\n##89690\n#RRGGBB\n#RRGG8B',
    '#833'
  );

  // 3. Inserisci Stringhe di Controllo Segrete
  const insertCS = db.prepare(`
    INSERT INTO riddle_control_strings (id, riddle_id, string_value, is_positive)
    VALUES (?, ?, ?, ?)
  `);

  // Enigma 1 (4 cifre)
  insertCS.run(1, 1, '1234', 1);
  insertCS.run(2, 1, '9999', 1);
  insertCS.run(3, 1, '123', 0);
  insertCS.run(4, 1, '12345', 0);

  // Enigma 2 (Email)
  insertCS.run(5, 2, 'user@test.com', 1);
  insertCS.run(6, 2, 'admin@domain.it', 1);
  insertCS.run(7, 2, 'invalidemail', 0);

  // Enigma 3 (Hex Color)
  insertCS.run(8, 3, '#ff0000', 1);
  insertCS.run(9, 3, '#00ff00', 1);
  insertCS.run(10, 3, '123456', 0);

  // 4. Inserisci Tentativi per simulare Solved Count dallo screenshot
  const insertAttempt = db.prepare(`
    INSERT INTO attempts (id, user_id, riddle_id, proposed_regex, pos_passed_count, neg_passed_count, total_pos_count, total_neg_count, is_solved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Riddle 1 (mario_dev) solved by 2 users (e.g. user 2 and user 4 "gigi")
  insertAttempt.run(1, 2, 1, '^[0-9]{4}$', 2, 2, 2, 2, 1);
  insertAttempt.run(2, 4, 1, '^[0-9]{4}$', 2, 2, 2, 2, 1); // Gigi solved it -> "RISOLTO" tag!

  // Riddle 3 (peach_script) solved by 5 attempts/users
  insertAttempt.run(3, 1, 3, '^#[0-9a-fA-F]{6}$', 2, 1, 2, 1, 1);
  insertAttempt.run(4, 2, 3, '^#[0-9a-fA-F]{6}$', 2, 1, 2, 1, 1);
  insertAttempt.run(5, 4, 3, '^#[0-9a-fA-F]{6}$', 2, 1, 2, 1, 1);

  console.log('✅ Popolamento dati demo completato con successo!');
}

seedDatabase();
