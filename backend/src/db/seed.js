const db = require('./database');
const bcrypt = require('bcryptjs');

function seedDatabase() {
  console.log('🌱 Popolamento database con dati demo per la presentazione...');

  // 1. Inserisci Utenti Demo
  const passHash = bcrypt.hashSync('Password123!', 10);
  
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash)
    VALUES (?, ?, ?, ?)
  `);

  insertUser.run(1, 'prof_starace', 'prof@unina.it', passHash);
  insertUser.run(2, 'regex_master', 'master@regexriddle.it', passHash);
  insertUser.run(3, 'coder_student', 'student@unina.it', passHash);

  // 2. Inserisci Enigmi Demo
  const insertRiddle = db.prepare(`
    INSERT OR IGNORE INTO riddles (id, author_id, title, description, secret_regex, public_pos_example, public_neg_example)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertRiddle.run(
    1,
    1,
    'Validazione Indirizzo IP v4',
    'Crea una regex che accetti un formato IP classico a 4 ottetti numerici separati da punti (es. 192.168.1.1).',
    '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$',
    '192.168.1.1',
    '192.168.1'
  );

  insertRiddle.run(
    2,
    2,
    'Codice Fiscale Italiano (Iniziale)',
    'Crea una regex per la prima parte del Codice Fiscale: 6 lettere (cognome/nome) seguiti da 2 cifre numeriche dell\'anno.',
    '^[A-Z]{6}[0-9]{2}$',
    'RSSMRA85',
    'RSMRA85'
  );

  insertRiddle.run(
    3,
    2,
    'Formato Ora 24h (HH:MM)',
    'Riconosci solo orari validi nel formato 24 ore da 00:00 a 23:59.',
    '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$',
    '14:30',
    '25:61'
  );

  // 3. Inserisci Stringhe di Controllo Segrete
  const insertCS = db.prepare(`
    INSERT OR IGNORE INTO riddle_control_strings (id, riddle_id, string_value, is_positive)
    VALUES (?, ?, ?, ?)
  `);

  // Enigma 1 IP
  insertCS.run(1, 1, '10.0.0.1', 1);
  insertCS.run(2, 1, '172.16.254.1', 1);
  insertCS.run(3, 1, '127.0.0.1', 1);
  insertCS.run(4, 1, '256.1.1', 0);
  insertCS.run(5, 1, 'abc.def.ghi.jkl', 0);
  insertCS.run(6, 1, '192.168.1.1.1', 0);

  // Enigma 2 CF
  insertCS.run(7, 2, 'DFLMRA98', 1);
  insertCS.run(8, 2, 'BNCLSN01', 1);
  insertCS.run(9, 2, 'ABCD12', 0);
  insertCS.run(10, 2, 'ABCDEFGH', 0);

  // Enigma 3 Ora
  insertCS.run(11, 3, '00:00', 1);
  insertCS.run(12, 3, '23:59', 1);
  insertCS.run(13, 3, '12:00', 1);
  insertCS.run(14, 3, '24:00', 0);
  insertCS.run(15, 3, '12:60', 0);

  // 4. Inserisci Tentativi ed Enigmi Risolti per la Classifica Demo
  const insertAttempt = db.prepare(`
    INSERT OR IGNORE INTO attempts (id, user_id, riddle_id, proposed_regex, pos_passed_count, neg_passed_count, total_pos_count, total_neg_count, is_solved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAttempt.run(1, 3, 1, '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$', 3, 3, 3, 3, 1);
  insertAttempt.run(2, 3, 2, '^[A-Z]{6}[0-9]{2}$', 2, 2, 2, 2, 1);
  insertAttempt.run(3, 2, 1, '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$', 3, 3, 3, 3, 1);

  console.log('✅ Popolamento dati demo completato!');
}

seedDatabase();
