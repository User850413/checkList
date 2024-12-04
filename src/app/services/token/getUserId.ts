import jwt from 'jsonwebtoken';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { verifyAuthToken } from './verifyToken';

export const getUserId = (req: Request): { userId: string; error?: string } => {
  let userId = '';

  const { error, token } = verifyAuthToken(req);

  if (error) {
    return { userId, error };
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) return { userId, error: ERROR_MESSAGES.JWT_SECRET_ERROR.ko };
  const decoded = jwt.verify(token!, JWT_SECRET) as { id: string };

  userId = decoded.id;

  return { userId };
};
