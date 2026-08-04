const db = require('../db/database');
const regexService = require('../services/regexService');

function createRiddle(req, res, next) {
  try {
    const {
      title,
      description,
      secret_regex,
      public_pos_example,
      public_neg_example,
      control_pos_strings,
      control_neg_strings
    } = req.body;

    if (!title || !description || !secret_regex || public_pos_example === undefined || public_neg_example === undefined) {
      return res.status(400).json({ error: 'Tutti i campi principali dell\'enigma sono obbligatori.' });
    }

    // Valida la sintassi della Regex segreta fornita dall'autore
    let compiledRegex;
    try {
      compiledRegex = regexService.compileRegex(secret_regex);
    } catch (err) {
      return res.status(400).json({ error: `La Regex segreta non è valida: ${err.message}` });
    }

    // Verifica che la regex segreta soddisfi l'esempio pubblico positivo
    if (!compiledRegex.test(public_pos_example)) {
      return res.status(400).json({ error: 'La tua Regex segreta NON soddisfa l\'esempio positivo pubblico fornito.' });
    }

    // Verifica che la regex segreta NON soddisfi l'esempio pubblico negativo
    if (compiledRegex.test(public_neg_example)) {
      return res.status(400).json({ error: 'La tua Regex segreta soddisfa (erroneamente) l\'esempio negativo pubblico fornito.' });
    }

    // Processa le stringhe di controllo (fino a 10 positive e fino a 10 negative)
    const posStrings = Array.isArray(control_pos_strings) ? control_pos_strings.slice(0, 10).filter(s => s !== undefined && s !== '') : [];
    const negStrings = Array.isArray(control_neg_strings) ? control_neg_strings.slice(0, 10).filter(s => s !== undefined && s !== '') : [];

    if (posStrings.length === 0 || negStrings.length === 0) {
      return res.status(400).json({ error: 'Fornisci almeno 1 stringa di controllo positiva e 1 negativa.' });
    }

    // Verifica che la regex segreta dell'autore soddisfi tutte le stringhe di controllo
    for (const str of posStrings) {
      if (!compiledRegex.test(str)) {
        return res.status(400).json({ error: `La tua Regex segreta non soddisfa la stringa di controllo positiva: "${str}"` });
      }
    }
    for (const str of negStrings) {
      if (compiledRegex.test(str)) {
        return res.status(400).json({ error: `La tua Regex segreta soddisfa (erroneamente) la stringa di controllo negativa: "${str}"` });
      }
    }

    // Transazione per inserire enigma e stringhe di controllo
    const insertTransaction = db.transaction(() => {
      const stmtRiddle = db.prepare(`
        INSERT INTO riddles (author_id, title, description, secret_regex, public_pos_example, public_neg_example)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmtRiddle.run(req.user.id, title.trim(), description.trim(), secret_regex.trim(), public_pos_example, public_neg_example);
      const riddleId = result.lastInsertRowid;

      const stmtCS = db.prepare(`
        INSERT INTO riddle_control_strings (riddle_id, string_value, is_positive)
        VALUES (?, ?, ?)
      `);

      for (const str of posStrings) {
        stmtCS.run(riddleId, str, 1);
      }
      for (const str of negStrings) {
        stmtCS.run(riddleId, str, 0);
      }

      return riddleId;
    });

    const riddleId = insertTransaction();

    res.status(201).json({
      message: 'Enigma creato con successo!',
      riddle_id: riddleId
    });
  } catch (err) {
    next(err);
  }
}

function getAllRiddles(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;

    const query = `
      SELECT 
        r.id,
        r.title,
        r.description,
        r.public_pos_example,
        r.public_neg_example,
        r.created_at,
        u.id AS author_id,
        u.username AS author_name,
        u.avatar_url AS author_avatar,
        COUNT(DISTINCT a.id) AS total_attempts,
        COUNT(DISTINCT CASE WHEN a.is_solved = 1 THEN a.user_id END) AS solved_by_count,
        MAX(CASE WHEN a.user_id = ? AND a.is_solved = 1 THEN 1 ELSE 0 END) AS is_solved_by_current_user
      FROM riddles r
      JOIN users u ON r.author_id = u.id
      LEFT JOIN attempts a ON r.id = a.riddle_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;

    const riddles = db.prepare(query).all(userId || 0);

    res.json({ riddles });
  } catch (err) {
    next(err);
  }
}

function getRiddleById(req, res, next) {
  try {
    const riddleId = req.params.id;
    const userId = req.user ? req.user.id : null;

    const riddle = db.prepare(`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.public_pos_example,
        r.public_neg_example,
        r.created_at,
        u.id AS author_id,
        u.username AS author_name,
        u.avatar_url AS author_avatar
      FROM riddles r
      JOIN users u ON r.author_id = u.id
      WHERE r.id = ?
    `).get(riddleId);

    if (!riddle) {
      return res.status(404).json({ error: 'Enigma non trovato.' });
    }

    // Controlla se l'utente ha già risolto l'enigma
    let isSolved = false;
    let userAttempts = [];
    if (userId) {
      const solvedCheck = db.prepare(`
        SELECT id FROM attempts WHERE riddle_id = ? AND user_id = ? AND is_solved = 1 LIMIT 1
      `).get(riddleId, userId);
      isSolved = !!solvedCheck;

      userAttempts = db.prepare(`
        SELECT proposed_regex, pos_passed_count, total_pos_count, neg_passed_count, total_neg_count, is_solved, created_at
        FROM attempts
        WHERE riddle_id = ? AND user_id = ?
        ORDER BY created_at DESC
      `).all(riddleId, userId);
    }

    res.json({
      riddle: {
        ...riddle,
        is_solved: isSolved
      },
      attempts: userAttempts
    });
  } catch (err) {
    next(err);
  }
}

function submitAttempt(req, res, next) {
  try {
    const riddleId = req.params.id;
    const { proposed_regex } = req.body;

    if (!proposed_regex) {
      return res.status(400).json({ error: 'Inserisci un\'espressione regolare per il tentativo.' });
    }

    const riddle = db.prepare('SELECT id FROM riddles WHERE id = ?').get(riddleId);
    if (!riddle) {
      return res.status(404).json({ error: 'Enigma non trovato.' });
    }

    // Recupera le stringhe di controllo segrete dell'enigma
    const controlStrings = db.prepare(`
      SELECT string_value, is_positive FROM riddle_control_strings WHERE riddle_id = ?
    `).all(riddleId);

    // Valuta la regex proposta
    let evalResult;
    try {
      evalResult = regexService.evaluateAttempt(proposed_regex, controlStrings);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const isSolvedInt = evalResult.isSolved ? 1 : 0;

    // Salva il tentativo nel database
    db.prepare(`
      INSERT INTO attempts 
      (user_id, riddle_id, proposed_regex, pos_passed_count, neg_passed_count, total_pos_count, total_neg_count, is_solved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      riddleId,
      proposed_regex.trim(),
      evalResult.posPassedCount,
      evalResult.negPassedCount,
      evalResult.totalPosCount,
      evalResult.totalNegCount,
      isSolvedInt
    );

    res.json({
      message: evalResult.isSolved 
        ? '🎉 Complimenti! La tua Regex soddisfa tutte le stringhe di controllo!' 
        : 'Soluzione non ancora corretta. Riprova!',
      result: {
        proposed_regex: proposed_regex.trim(),
        pos_passed_count: evalResult.posPassedCount,
        total_pos_count: evalResult.totalPosCount,
        neg_passed_count: evalResult.negPassedCount,
        total_neg_count: evalResult.totalNegCount,
        is_solved: evalResult.isSolved
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRiddle,
  getAllRiddles,
  getRiddleById,
  submitAttempt
};
