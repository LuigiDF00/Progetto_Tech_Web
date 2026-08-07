# ⚡ RegexRiddle — Cyberpunk Regex Challenge Platform

**RegexRiddle** è un'applicazione web full-stack sviluppata con architettura moderna **Node.js/Express + React + TypeScript** e caratterizzata da un'interfaccia utente stile **Cyberpunk 2077 / Retro Arcade HUD**.

Il progetto è stato realizzato per l'esame di **Tecnologie Web** presso l'**Università degli Studi di Napoli Federico II** (Corso di Laurea in Informatica).

---

## 🌟 Funzionalità Principali

- 🔐 **Autenticazione & Gestione Utenti**: Registratione, login sicuro tramite **JWT (JSON Web Token)** e password cifrate con **Bcrypt**.
- 🖼️ **Profilo Cyberware & Avatar Upload**: Personalizzazione del profilo con upload di immagini avatar tramite **Multer** e conteggio in tempo reale delle metriche personali.
- 🧩 **Creazione Enigmi Regolati**:
  - Definizione di una **Regex segreta** (nota solo al server e all'autore).
  - Impostazione di 1 esempio pubblico positivo e 1 negativo visibili a tutti.
  - Generazione di **vettori di controllo segreti** (fino a 10 stringhe positive e 10 negative).
- 🕹️ **Console di Hacking & Real-Time Testing**:
  - Terminali CRT in stile fosfori per verificare le risposte.
  - Valutazione istantanea del server rispetto al 100% delle stringhe di controllo segrete.
  - Indicatore di progresso visuale per i match completati.
- 🏆 **Hall of Fame & Global High Scores**:
  - Podio Cyberpunk Top 3 in evidenza con trofei pixel Oro, Argento e Bronzo.
  - Algoritmo di ranking basato su:
    1. Maggior numero di enigmi distinti risolti.
    2. Minor numero medio di tentativi per enigma.
- 📖 **Manuale di Sistema Interattivo**: Guida dettagliata ai protocolli di sfida e alle regole di calcolo del punteggio.

---

## 🛠️ Stack Tecnologico

### Backend
- **Linguaggio**: TypeScript (Node.js)
- **Framework Web**: Express.js
- **Database & ORM**: SQLite + Sequelize ORM
- **Autenticazione**: JSON Web Tokens (JWT) + Bcrypt.js
- **Upload File**: Multer (gestione immagini avatar)
- **Testing**: Jest + Supertest

### Frontend
- **Linguaggio**: TypeScript (React 18)
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **Design System**: Vanilla CSS 3 (Cyberpunk 2077 HUD, neon glow, CRT scanlines, glassmorphism, responsive grid)
- **Iconografia**: Lucide React + Pixel Icons SVG personalizzate

---

## 📁 Struttura della Repository

```text
Progetto_Tech_Web/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurazione database Sequelize / SQLite
│   │   ├── controllers/     # Controller MVC (Auth, Riddle, Attempt, Profile, Leaderboard)
│   │   ├── middleware/      # Middleware autenticazione JWT e upload Multer
│   │   ├── models/          # Modelli Sequelize (User, Riddle, ControlString, Attempt)
│   │   ├── routes/          # Definizioni delle rotte API REST
│   │   ├── services/        # Logica di business ed il motore di validazione Regex
│   │   ├── db/              # Database SQLite e script di seeding dati
│   │   └── server.ts        # Punto d'ingresso dell'applicazione backend Express
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componenti riutilizzabili (Navbar, Footer, PixelIcons)
│   │   ├── context/         # AuthContext per la gestione dello stato di autenticazione
│   │   ├── pages/           # Pagine dell'applicazione (Home, Riddles, Detail, Create, Leaderboard, Profile, Rules)
│   │   ├── services/        # Client API HTTP Axios/Fetch per interagire col Backend
│   │   ├── types/           # Interfacce TypeScript condivise (User, Riddle, Attempt, LeaderboardEntry)
│   │   ├── App.tsx          # Router principale e rotte protette
│   │   ├── index.css        # Cuore del Design System Cyberpunk 2077 HUD
│   │   └── main.tsx         # Entry point React
│   ├── package.json
│   └── tsconfig.json
│
├── COME_FUNZIONA.md         # Documentazione dettagliata sull'architettura ed il funzionamento
└── README.md                # Questo file
```

---

## 🚀 Requisiti e Guida all'Installazione

### Prerequisiti
- **Node.js** (versione `>= 18.x`)
- **npm** (versione `>= 9.x`)

---

### 1. Configurazione Backend

1. Entra nella cartella `backend`:
   ```bash
   cd backend
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il database di test e popula i dati iniziali (seeding):
   ```bash
   npm run seed
   ```
4. Avvia il server in modalità sviluppo (porta `5000`):
   ```bash
   npm run dev
   ```

---

### 2. Configurazione Frontend

1. Apri un nuovo terminale ed entra nella cartella `frontend`:
   ```bash
   cd frontend
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo Vite (porta `5173` o `5175`):
   ```bash
   npm run dev
   ```
4. Apri il browser all'indirizzo mostrato nel terminale (es. `http://localhost:5173`).

---

## 🧪 Esecuzione dei Test

Per eseguire la suite di test automatizzati del Backend:

```bash
cd backend
npm test
```

---

## 📘 Documentazione Dettagliata

Per una spiegazione approfondita sull'architettura MVC, il funzionamento del motore di matching Regex segreto e l'algoritmo della classifica, consulta il file:
👉 **[COME_FUNZIONA.md](./COME_FUNZIONA.md)**

---

## 👨‍💻 Autore e Crediti

- **Corso**: Tecnologie Web (Laurea in Informatica)
- **Ateneo**: Università degli Studi di Napoli Federico II
