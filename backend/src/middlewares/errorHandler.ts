import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('❌ Errore Backend non gestito:', err);
  const status = err.status || 500;
  const message = err.message || 'Errore interno del server.';
  res.status(status).json({ error: message });
}

export default errorHandler;
