import app from './app';
import { sequelize } from './models';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connessione al database SQLite stabilita tramite Sequelize (TypeScript).');

    await sequelize.sync();
    console.log('✅ Modelli Sequelize sincronizzati con successo.');

    app.listen(PORT, () => {
      console.log(`🚀 Server HTTP avviato sulla porta ${PORT} in ambiente ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Errore durante l\'avvio del server:', err);
    process.exit(1);
  }
}

startServer();
