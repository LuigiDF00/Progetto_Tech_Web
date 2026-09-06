import { User } from '../models';

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      username: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
