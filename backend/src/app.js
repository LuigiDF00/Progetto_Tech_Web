require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const riddleRoutes = require('./routes/riddleRoutes');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware di base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servizio file statici per gli avatar caricati
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Definizione API Sub-routes
app.use('/api/auth', authRoutes);
app.use('/api/riddles', riddleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Rotta per verificare lo stato dell'API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware di gestione errori
app.use(errorHandler);

module.exports = app;
