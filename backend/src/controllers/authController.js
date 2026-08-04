const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email e password sono obbligatori.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ error: 'Lo username deve contenere almeno 3 caratteri.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La password deve contenere almeno 6 caratteri.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username.trim(), email.trim().toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'Username o email già in uso.' });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
    const result = stmt.run(username.trim(), email.trim().toLowerCase(), password_hash);

    const user = {
      id: result.lastInsertRowid,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      avatar_url: null
    };

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registrazione avvenuta con successo.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
}

function login(req, res, next) {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Inserisci username/email e password.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?')
      .get(usernameOrEmail.trim(), usernameOrEmail.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login effettuato con successo.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url
      }
    });
  } catch (err) {
    next(err);
  }
}

function me(req, res, next) {
  try {
    const user = db.prepare('SELECT id, username, email, avatar_url, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato.' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  me
};
