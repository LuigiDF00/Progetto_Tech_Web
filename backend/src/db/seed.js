const db = require('./database');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('🌱 Popolamento database con nuovi enigmi e creatori...');

  // 1. Inserisci Utenti Demo
  const passHash = bcrypt.hashSync('Password123!', 10);
  
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash)
    VALUES (?, ?, ?, ?)
  `);

  insertUser.run(1, 'Dev_Mario', 'mario@regexriddle.it', passHash);
  insertUser.run(2, 'Dev_Luigi', 'luigi@regexriddle.it', passHash);
  insertUser.run(3, 'Dev_Peach', 'peach@regexriddle.it', passHash);
  insertUser.run(4, 'Dev_Toad', 'toad@regexriddle.it', passHash);
  insertUser.run(5, 'Dev_Yoshi', 'yoshi@regexriddle.it', passHash);
  insertUser.run(6, 'Dev_Browser', 'browser@regexriddle.it', passHash);

  // 2. Inserisci Enigmi Demo
  const insertRiddle = db.prepare(`
    INSERT OR IGNORE INTO riddles (id, author_id, title, description, secret_regex, public_pos_example, public_neg_example)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Enigma 1: ORO (5 risoluzioni)
  insertRiddle.run(
    1,
    1,
    'SOLO NUMERI DI 4 CIFRE',
    'Trova la regex che accetta esattamente 4 cifre numeriche. Nessun altro carattere è permesso.',
    '^\\d{4}$',
    '1234',
    '123'
  );

  // Enigma 2: ARGENTO (3 risoluzioni)
  insertRiddle.run(
    2,
    2,
    'MATCH EMAIL',
    'Scrivi una regex per validare indirizzi email comuni (es. nome@dominio.com).',
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    'mario@email.com',
    'mario@email'
  );

  // Enigma 3: BRONZO (2 risoluzioni)
  insertRiddle.run(
    3,
    3,
    'HEX COLOR CODES',
    'Crea una regex per i codici colore esadecimali (#RRGGBB o #RGB).',
    '^#(?:[0-9a-fA-F]{3}){1,2}$',
    '#ff0099',
    '#ff00'
  );

  // Enigma 4: 1 risoluzione
  insertRiddle.run(
    4,
    4,
    'URL SICURO (HTTPS)',
    'Riconosci solo URL sicuri che iniziano con https:// e hanno un dominio valido.',
    '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(?:/.*)?$',
    'https://www.google.com',
    'http://www.google.com'
  );

  // Enigma 5: 0 risoluzioni
  insertRiddle.run(
    5,
    5,
    'DATA FORMATO YYYY-MM-DD',
    'Crea una regex che validi una data nel formato standard internazionale YYYY-MM-DD.',
    '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$',
    '2026-09-06',
    '2026-13-40'
  );

  // 3. Inserisci Stringhe di Controllo Segrete
  const insertCS = db.prepare(`
    INSERT OR IGNORE INTO riddle_control_strings (id, riddle_id, string_value, is_positive)
    VALUES (?, ?, ?, ?)
  `);

  // E1
  insertCS.run(1, 1, '9999', 1);
  insertCS.run(2, 1, '0000', 1);
  insertCS.run(3, 1, '12345', 0);
  insertCS.run(4, 1, 'abcd', 0);

  // E2
  insertCS.run(5, 2, 'test.123@domain.co.uk', 1);
  insertCS.run(6, 2, 'user+filter@gmail.com', 1);
  insertCS.run(7, 2, 'test@.com', 0);
  insertCS.run(8, 2, 'test@domain', 0);

  // E3
  insertCS.run(9, 3, '#FFF', 1);
  insertCS.run(10, 3, '#123456', 1);
  insertCS.run(11, 3, '#12345', 0);
  insertCS.run(12, 3, '123456', 0);

  // E4
  insertCS.run(13, 4, 'https://github.com/test', 1);
  insertCS.run(14, 4, 'https://api.site.org', 1);
  insertCS.run(15, 4, 'ftp://files.site.com', 0);
  insertCS.run(16, 4, 'https://site', 0);

  // E5
  insertCS.run(17, 5, '1999-12-31', 1);
  insertCS.run(18, 5, '2024-02-29', 1); // Semplicistico, va bene
  insertCS.run(19, 5, '20-01-2024', 0);
  insertCS.run(20, 5, '2024-1-1', 0);

  // 4. Inserisci Tentativi ed Enigmi Risolti per la Classifica Demo
  const insertAttempt = db.prepare(`
    INSERT OR IGNORE INTO attempts (id, user_id, riddle_id, proposed_regex, pos_passed_count, neg_passed_count, total_pos_count, total_neg_count, is_solved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let attemptId = 1;
  // Enigma 1 (5 risoluzioni: user 2,3,4,5,6)
  insertAttempt.run(attemptId++, 2, 1, '^\\d{4}$', 2, 2, 2, 2, 1);
  insertAttempt.run(attemptId++, 3, 1, '^\\d{4}$', 2, 2, 2, 2, 1);
  insertAttempt.run(attemptId++, 4, 1, '^\\d{4}$', 2, 2, 2, 2, 1);
  insertAttempt.run(attemptId++, 5, 1, '^\\d{4}$', 2, 2, 2, 2, 1);
  insertAttempt.run(attemptId++, 6, 1, '^\\d{4}$', 2, 2, 2, 2, 1);

  // Enigma 2 (3 risoluzioni: user 1,3,4)
  insertAttempt.run(attemptId++, 1, 2, '.*', 2, 2, 2, 2, 1); // Fake solve per i dati demo
  insertAttempt.run(attemptId++, 3, 2, '.*', 2, 2, 2, 2, 1);
  insertAttempt.run(attemptId++, 4, 2, '.*', 2, 2, 2, 2, 1);

  // Enigma 3 (2 risoluzioni: user 1,2)
  insertAttempt.run(attemptId++, 1, 3, '.*', 2, 2, 2, 2, 1);
  insertAttempt.run(attemptId++, 2, 3, '.*', 2, 2, 2, 2, 1);

  // Enigma 4 (1 risoluzione: user 1)
  insertAttempt.run(attemptId++, 1, 4, '.*', 2, 2, 2, 2, 1);

  console.log('✅ Popolamento dati demo completato con successo!');
}

seedDatabase();
