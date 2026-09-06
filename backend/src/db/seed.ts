import { sequelize, User, Riddle, ControlString, Attempt } from '../models';
import bcrypt from 'bcryptjs';

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Popolamento database con dati demo per la presentazione (Sequelize TypeScript)...');

  await sequelize.sync({ force: true });

  const passHash = bcrypt.hashSync('Password123!', 10);

  const mario = await User.create({
    id: 1,
    username: 'mario_dev',
    email: 'mario@regexriddle.it',
    password_hash: passHash
  });

  const luigi = await User.create({
    id: 2,
    username: 'luigi_code',
    email: 'luigi@regexriddle.it',
    password_hash: passHash
  });

  const peach = await User.create({
    id: 3,
    username: 'peach_script',
    email: 'peach@regexriddle.it',
    password_hash: passHash
  });

  const gigi = await User.create({
    id: 4,
    username: 'gigi',
    email: 'gigi@regexriddle.it',
    password_hash: passHash
  });

  const riddle1 = await Riddle.create({
    id: 1,
    author_id: mario.id,
    title: 'SOLO NUMERI DI 4 CIFRE',
    description: 'Trova la regex che accetta esattamente 4 cifre numeriche.',
    secret_regex: '^[0-9]{4}$',
    public_pos_example: '11234\n12336\n12345\n18789',
    public_neg_example: '123'
  });

  const riddle2 = await Riddle.create({
    id: 2,
    author_id: luigi.id,
    title: 'MATCH EMAIL',
    description: 'Scrivi una regex per validare indirizzi email comuni.',
    secret_regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    public_pos_example: 'luig@email.com\nluigi@email.com\nluigiemail.com\nluigi@email.com',
    public_neg_example: 'luigiemail.com'
  });

  const riddle3 = await Riddle.create({
    id: 3,
    author_id: peach.id,
    title: 'HEX COLOR CODES',
    description: 'Crea una regex per i codici colore esadecimali (#RRGGBB).',
    secret_regex: '^#[0-9a-fA-F]{6}$',
    public_pos_example: '#833255\n##89690\n#RRGGBB\n#RRGG8B',
    public_neg_example: '#833'
  });

  await ControlString.bulkCreate([
    { id: 1, riddle_id: riddle1.id, string_value: '1234', is_positive: 1 },
    { id: 2, riddle_id: riddle1.id, string_value: '9999', is_positive: 1 },
    { id: 3, riddle_id: riddle1.id, string_value: '123', is_positive: 0 },
    { id: 4, riddle_id: riddle1.id, string_value: '12345', is_positive: 0 },

    { id: 5, riddle_id: riddle2.id, string_value: 'user@test.com', is_positive: 1 },
    { id: 6, riddle_id: riddle2.id, string_value: 'admin@domain.it', is_positive: 1 },
    { id: 7, riddle_id: riddle2.id, string_value: 'invalidemail', is_positive: 0 },

    { id: 8, riddle_id: riddle3.id, string_value: '#ff0000', is_positive: 1 },
    { id: 9, riddle_id: riddle3.id, string_value: '#00ff00', is_positive: 1 },
    { id: 10, riddle_id: riddle3.id, string_value: '123456', is_positive: 0 }
  ]);

  await Attempt.bulkCreate([
    { id: 1, user_id: luigi.id, riddle_id: riddle1.id, proposed_regex: '^[0-9]{4}$', pos_passed_count: 2, neg_passed_count: 2, total_pos_count: 2, total_neg_count: 2, is_solved: 1 },
    { id: 2, user_id: gigi.id, riddle_id: riddle1.id, proposed_regex: '^[0-9]{4}$', pos_passed_count: 2, neg_passed_count: 2, total_pos_count: 2, total_neg_count: 2, is_solved: 1 },
    { id: 3, user_id: mario.id, riddle_id: riddle3.id, proposed_regex: '^#[0-9a-fA-F]{6}$', pos_passed_count: 2, neg_passed_count: 1, total_pos_count: 2, total_neg_count: 1, is_solved: 1 },
    { id: 4, user_id: luigi.id, riddle_id: riddle3.id, proposed_regex: '^#[0-9a-fA-F]{6}$', pos_passed_count: 2, neg_passed_count: 1, total_pos_count: 2, total_neg_count: 1, is_solved: 1 },
    { id: 5, user_id: gigi.id, riddle_id: riddle3.id, proposed_regex: '^#[0-9a-fA-F]{6}$', pos_passed_count: 2, neg_passed_count: 1, total_pos_count: 2, total_neg_count: 1, is_solved: 1 }
  ]);

  console.log('✅ Popolamento dati demo con Sequelize TypeScript completato con successo!');
}

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('❌ Errore durante il seeding:', err);
    process.exit(1);
  });
}

export default seedDatabase;
