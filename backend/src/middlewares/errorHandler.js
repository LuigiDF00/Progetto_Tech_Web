function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Errore interno del server.';

  res.status(statusCode).json({
    error: message
  });
}

module.exports = errorHandler;
