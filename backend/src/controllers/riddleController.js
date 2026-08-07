const { sequelize, Riddle, ControlString, Attempt, User } = require('../models');
const regexService = require('../services/regexService');

async function createRiddle(req, res, next) {
  const transaction = await sequelize.transaction();
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
      await transaction.rollback();
      return res.status(400).json({ error: 'Tutti i campi principali dell\'enigma sono obbligatori.' });
    }

    let compiledRegex;
    try {
      compiledRegex = regexService.compileRegex(secret_regex);
    } catch (err) {
      await transaction.rollback();
      return res.status(400).json({ error: `La Regex segreta non è valida: ${err.message}` });
    }

    if (!compiledRegex.test(public_pos_example)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'La tua Regex segreta NON soddisfa l\'esempio positivo pubblico fornito.' });
    }

    if (compiledRegex.test(public_neg_example)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'La tua Regex segreta soddisfa (erroneamente) l\'esempio negativo pubblico fornito.' });
    }

    const posStrings = Array.isArray(control_pos_strings) ? control_pos_strings.slice(0, 10).filter(s => s !== undefined && s !== '') : [];
    const negStrings = Array.isArray(control_neg_strings) ? control_neg_strings.slice(0, 10).filter(s => s !== undefined && s !== '') : [];

    if (posStrings.length === 0 || negStrings.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Fornisci almeno 1 stringa di controllo positiva e 1 negativa.' });
    }

    for (const str of posStrings) {
      if (!compiledRegex.test(str)) {
        await transaction.rollback();
        return res.status(400).json({ error: `La tua Regex segreta non soddisfa la stringa di controllo positiva: "${str}"` });
      }
    }
    for (const str of negStrings) {
      if (compiledRegex.test(str)) {
        await transaction.rollback();
        return res.status(400).json({ error: `La tua Regex segreta soddisfa (erroneamente) la stringa di controllo negativa: "${str}"` });
      }
    }

    const riddle = await Riddle.create({
      author_id: req.user.id,
      title: title.trim(),
      description: description.trim(),
      secret_regex: secret_regex.trim(),
      public_pos_example,
      public_neg_example
    }, { transaction });

    const controlStringRecords = [
      ...posStrings.map(str => ({ riddle_id: riddle.id, string_value: str, is_positive: 1 })),
      ...negStrings.map(str => ({ riddle_id: riddle.id, string_value: str, is_positive: 0 }))
    ];

    await ControlString.bulkCreate(controlStringRecords, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Enigma creato con successo!',
      riddle_id: riddle.id
    });
  } catch (err) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    next(err);
  }
}

async function getAllRiddles(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;

    const riddles = await Riddle.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: Attempt,
          as: 'attempts',
          attributes: ['id', 'user_id', 'is_solved']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedRiddles = riddles.map(r => {
      const attempts = r.attempts || [];
      const solvedAttempts = attempts.filter(a => a.is_solved === 1);
      const uniqueSolvedUsers = new Set(solvedAttempts.map(a => a.user_id));
      const isSolvedByCurrentUser = userId ? attempts.some(a => a.user_id === userId && a.is_solved === 1) : false;

      return {
        id: r.id,
        title: r.title,
        description: r.description,
        public_pos_example: r.public_pos_example,
        public_neg_example: r.public_neg_example,
        created_at: r.created_at,
        author_id: r.author ? r.author.id : null,
        author_name: r.author ? r.author.username : 'Unknown',
        author_avatar: r.author ? r.author.avatar_url : null,
        total_attempts: attempts.length,
        solved_by_count: uniqueSolvedUsers.size,
        is_solved_by_current_user: isSolvedByCurrentUser ? 1 : 0
      };
    });

    res.json({ riddles: formattedRiddles });
  } catch (err) {
    next(err);
  }
}

async function getRiddleById(req, res, next) {
  try {
    const riddleId = req.params.id;
    const userId = req.user ? req.user.id : null;

    const riddle = await Riddle.findByPk(riddleId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar_url']
        }
      ]
    });

    if (!riddle) {
      return res.status(404).json({ error: 'Enigma non trovato.' });
    }

    let isSolved = false;
    let userAttempts = [];

    if (userId) {
      const attempts = await Attempt.findAll({
        where: { riddle_id: riddleId, user_id: userId },
        order: [['created_at', 'DESC']]
      });

      isSolved = attempts.some(a => a.is_solved === 1);
      userAttempts = attempts.map(a => ({
        proposed_regex: a.proposed_regex,
        pos_passed_count: a.pos_passed_count,
        total_pos_count: a.total_pos_count,
        neg_passed_count: a.neg_passed_count,
        total_neg_count: a.total_neg_count,
        is_solved: a.is_solved,
        created_at: a.created_at
      }));
    }

    res.json({
      riddle: {
        id: riddle.id,
        title: riddle.title,
        description: riddle.description,
        public_pos_example: riddle.public_pos_example,
        public_neg_example: riddle.public_neg_example,
        created_at: riddle.created_at,
        author_id: riddle.author ? riddle.author.id : null,
        author_name: riddle.author ? riddle.author.username : 'Unknown',
        author_avatar: riddle.author ? riddle.author.avatar_url : null,
        is_solved: isSolved
      },
      attempts: userAttempts
    });
  } catch (err) {
    next(err);
  }
}

async function submitAttempt(req, res, next) {
  try {
    const riddleId = req.params.id;
    const { proposed_regex } = req.body;

    if (!proposed_regex) {
      return res.status(400).json({ error: 'Inserisci un\'espressione regolare per il tentativo.' });
    }

    const riddle = await Riddle.findByPk(riddleId);
    if (!riddle) {
      return res.status(404).json({ error: 'Enigma non trovato.' });
    }

    const controlStrings = await ControlString.findAll({
      where: { riddle_id: riddleId }
    });

    let evalResult;
    try {
      evalResult = regexService.evaluateAttempt(proposed_regex, controlStrings);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const isSolvedInt = evalResult.isSolved ? 1 : 0;

    await Attempt.create({
      user_id: req.user.id,
      riddle_id: riddleId,
      proposed_regex: proposed_regex.trim(),
      pos_passed_count: evalResult.posPassedCount,
      neg_passed_count: evalResult.negPassedCount,
      total_pos_count: evalResult.totalPosCount,
      total_neg_count: evalResult.totalNegCount,
      is_solved: isSolvedInt
    });

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
