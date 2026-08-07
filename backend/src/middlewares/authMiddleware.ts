import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_regexriddle_jwt_key_2026';

export interface UserJwtPayload {
  id: number;
  username: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void | Response {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accesso non autorizzato: token mancante.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({ error: 'Token non valido o scaduto.' });
    }
    req.user = decoded as UserJwtPayload;
    next();
  });
}

export function optionalAuthenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        req.user = decoded as UserJwtPayload;
      }
      next();
    });
  } else {
    next();
  }
}
