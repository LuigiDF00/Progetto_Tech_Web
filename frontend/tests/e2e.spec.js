import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const testUser = {
  username: `user_${timestamp}`,
  first_name: 'Mario',
  last_name: 'Rossi',
  email: `mario_${timestamp}@example.com`,
  password: 'Password123!'
};

const testRiddle = {
  title: `Enigma Numerico ${timestamp}`,
  description: 'Scopri la regex che accetta solo esattamente tre cifre numeriche.',
  secret_regex: '^[0-9]{3}$',
  public_pos_example: '123',
  public_neg_example: 'abc',
  pos_control: ['456', '789', '000'],
  neg_control: ['12', '1234', 'a12']
};

async function loginUser(page, username, password) {
  await page.goto('/');
  await page.waitForTimeout(200);

  // Se il pulsante Disconnetti è visibile, l'utente è autenticato con successo
  if (await page.getByTitle('Disconnetti').isVisible().catch(() => false)) {
    return;
  }

  await page.getByRole('button', { name: 'Accedi' }).first().click();
  await page.locator('.modal-container input[name="emailOrUsername"]').fill(username);
  await page.locator('.modal-container input[name="password"]').fill(password);
  await page.locator('.modal-container button[type="submit"]').click();
  await expect(page.getByTitle('Disconnetti')).toBeVisible();
}

test.describe.serial('RegexRiddle Full End-to-End Test Suite', () => {

  test('Test 1: Caricamento Landing Page e verifica titolo/componenti', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RegexRiddle/i);
    await expect(page.getByText('Metti alla prova le tue abilità').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Esplora Enigmi/i }).first()).toBeVisible();
  });

  test('Test 2: Consultazione Pagina "Come Funziona" (Regole)', async ({ page }) => {
    await page.goto('/rules');
    await expect(page.getByText('Come Funziona RegexRiddle').first()).toBeVisible();
    await expect(page.getByText('1. L\'Obiettivo del Gioco').first()).toBeVisible();
    await expect(page.getByText('2. Come Creare una Sfida').first()).toBeVisible();
  });

  test('Test 3: Registrazione Nuovo Utente', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Registrati' }).first().click();

    await page.locator('.modal-container input[name="username"]').fill(testUser.username);
    await page.locator('.modal-container input[name="first_name"]').fill(testUser.first_name);
    await page.locator('.modal-container input[name="last_name"]').fill(testUser.last_name);
    await page.locator('.modal-container input[name="email"]').fill(testUser.email);
    await page.locator('.modal-container input[name="password"]').fill(testUser.password);

    await page.locator('.modal-container button[type="submit"]').click();

    await expect(page.getByTitle('Disconnetti')).toBeVisible();
  });

  test('Test 4: Logout e Re-Login', async ({ page }) => {
    await page.goto('/');
    if (await page.getByTitle('Disconnetti').isVisible()) {
      await page.getByTitle('Disconnetti').click();
      await expect(page.getByRole('button', { name: 'Accedi' }).first()).toBeVisible();
    }

    await page.getByRole('button', { name: 'Accedi' }).first().click();
    await page.locator('.modal-container input[name="emailOrUsername"]').fill(testUser.username);
    await page.locator('.modal-container input[name="password"]').fill(testUser.password);
    await page.locator('.modal-container button[type="submit"]').click();

    await expect(page.getByTitle('Disconnetti')).toBeVisible();
  });

  test('Test 5: Visualizzazione Profilo Utente', async ({ page }) => {
    await loginUser(page, testUser.username, testUser.password);
    await page.goto('/profile');

    await expect(page.getByText(`@${testUser.username}`).first()).toBeVisible();
    await expect(page.getByText(/Carica Immagine Avatar/i).first()).toBeVisible();
  });

  test('Test 6: Creazione di un Nuovo Enigma RegexRiddle', async ({ page }) => {
    await loginUser(page, testUser.username, testUser.password);
    await page.goto('/create');

    await page.locator('input[placeholder*="IP v4"]').fill(testRiddle.title);
    await page.locator('textarea[placeholder*="Spiega"]').fill(testRiddle.description);
    await page.locator('input[placeholder*="0-9"]').first().fill(testRiddle.secret_regex);
    await page.locator('input[placeholder*="123-45"]').fill(testRiddle.public_pos_example);
    await page.locator('input[placeholder*="12-345"]').fill(testRiddle.public_neg_example);

    const posInputs = await page.locator('input[placeholder*="Positiva #"]').all();
    for (let i = 0; i < Math.min(posInputs.length, testRiddle.pos_control.length); i++) {
      await posInputs[i].fill(testRiddle.pos_control[i]);
    }

    const negInputs = await page.locator('input[placeholder*="Negativa #"]').all();
    for (let i = 0; i < Math.min(negInputs.length, testRiddle.neg_control.length); i++) {
      await negInputs[i].fill(testRiddle.neg_control[i]);
    }

    await page.getByRole('button', { name: /Pubblica Enigma/i }).click();

    await expect(page.getByText(testRiddle.title).first()).toBeVisible();
  });

  test('Test 7: Galleria Sfide e Ricerca Enigma', async ({ page }) => {
    await page.goto('/riddles');
    await expect(page.getByText('Galleria Sfide').first()).toBeVisible();

    await page.fill('input[placeholder*="Cerca per titolo"]', testRiddle.title);
    await expect(page.getByText(testRiddle.title).first()).toBeVisible();
  });

  test('Test 8: Invio Tentativo Errato e Verifica Feedback', async ({ page }) => {
    await loginUser(page, testUser.username, testUser.password);
    await page.getByRole('link', { name: /Galleria Sfide/i }).first().click();
    await page.fill('input[placeholder*="Cerca per titolo"]', testRiddle.title);

    const card = page.locator('.glass-card').filter({ hasText: testRiddle.title }).first();
    await expect(card).toBeVisible();
    await card.getByRole('link').click();

    await page.waitForURL(/\/riddles\/\d+/);
    await expect(page.getByRole('button', { name: 'Invia' })).toBeVisible();

    await page.locator('form input.code-input').fill('^.*$');
    await page.getByRole('button', { name: 'Invia' }).click();

    await expect(page.getByText(/Soluzione non ancora corretta|Riprova/i).first()).toBeVisible();
  });

  test('Test 9: Invio Soluzione Regex Corretta e Schermata Vittoria', async ({ page }) => {
    await loginUser(page, testUser.username, testUser.password);
    await page.getByRole('link', { name: /Galleria Sfide/i }).first().click();
    await page.fill('input[placeholder*="Cerca per titolo"]', testRiddle.title);

    const card = page.locator('.glass-card').filter({ hasText: testRiddle.title }).first();
    await expect(card).toBeVisible();
    await card.getByRole('link').click();

    await page.waitForURL(/\/riddles\/\d+/);
    await expect(page.getByRole('button', { name: 'Invia' })).toBeVisible();

    await page.locator('form input.code-input').fill(testRiddle.secret_regex);
    await page.getByRole('button', { name: 'Invia' }).click();

    await expect(page.getByText(/Complimenti! La tua Regex soddisfa tutte le stringhe/i).first()).toBeVisible();
    await expect(page.getByText('Enigma Risolto!').first()).toBeVisible();
  });

  test('Test 10: Consulta Classifica Globale (Leaderboard)', async ({ page }) => {
    await page.goto('/leaderboard');
    await expect(page.getByText('Classifica Globale Giocatori').first()).toBeVisible();
    await expect(page.getByText(testUser.username).first()).toBeVisible();
  });

  test('Test 11: Responsività Layout su Mobile Viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByText('RegexRiddle').first()).toBeVisible();
  });
});
