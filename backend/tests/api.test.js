const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('RegexRiddle REST API & E2E Tests (Sequelize ORM)', () => {
  let userToken;
  let userId;
  let riddleId;

  // Clean DB tables before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  test('1. GET /api/health deve restituire status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('2. POST /api/auth/register deve registrare un nuovo utente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'mario_dev',
        email: 'mario@test.it',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'mario_dev');

    userToken = res.body.token;
    userId = res.body.user.id;
  });

  test('3. POST /api/auth/register deve rifiutare username duplicato', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'mario_dev',
        email: 'altro@test.it',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('error');
  });

  test('4. POST /api/auth/login deve autenticare l\'utente correttamente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        usernameOrEmail: 'mario_dev',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  test('5. POST /api/auth/login deve rifiutare password errata', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        usernameOrEmail: 'mario_dev',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
  });

  test('6. GET /api/auth/me con token valido deve restituire i dati utente', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('username', 'mario_dev');
  });

  test('7. POST /api/riddles deve creare un nuovo enigma con successo', async () => {
    const res = await request(app)
      .post('/api/riddles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Solo numeri di 4 cifre',
        description: 'Trova la regex che accetta esattamente 4 cifre numeriche.',
        secret_regex: '^[0-9]{4}$',
        public_pos_example: '1234',
        public_neg_example: 'abc',
        control_pos_strings: ['1000', '9999', '5555'],
        control_neg_strings: ['123', '12345', 'a123', '123b']
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('riddle_id');
    riddleId = res.body.riddle_id;
  });

  test('8. POST /api/riddles deve rifiutare se la regex segreta non soddisfa l\'esempio positivo', async () => {
    const res = await request(app)
      .post('/api/riddles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Test Errato',
        description: 'Test',
        secret_regex: '^[a-z]+$',
        public_pos_example: '1234', // Non soddisfa ^[a-z]+$
        public_neg_example: 'abc',
        control_pos_strings: ['abc'],
        control_neg_strings: ['123']
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('NON soddisfa l\'esempio positivo');
  });

  test('9. GET /api/riddles deve elencare gli enigmi pubblicati', async () => {
    const res = await request(app).get('/api/riddles');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.riddles)).toBe(true);
    expect(res.body.riddles.length).toBeGreaterThan(0);
  });

  test('10. POST /api/riddles/:id/attempt con regex errata deve fallire la risoluzione', async () => {
    const res = await request(app)
      .post(`/api/riddles/${riddleId}/attempt`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        proposed_regex: '^[0-9]+$' // Accetta 12345 (che è tra le negazioni)
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.result.is_solved).toBe(false);
  });

  test('11. POST /api/riddles/:id/attempt con regex corretta deve risolvere l\'enigma', async () => {
    const res = await request(app)
      .post(`/api/riddles/${riddleId}/attempt`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        proposed_regex: '^\\d{4}$'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.result.is_solved).toBe(true);
    expect(res.body.result.pos_passed_count).toEqual(3);
    expect(res.body.result.neg_passed_count).toEqual(4);
  });

  test('12. GET /api/leaderboard deve restituire la classifica ordinata', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.leaderboard)).toBe(true);
    expect(res.body.leaderboard[0]).toHaveProperty('solved_count', 1);
  });
});
