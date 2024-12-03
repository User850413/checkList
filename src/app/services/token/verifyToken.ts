import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenResult {
  payload?: object | string;
  error?: string;
}

export function verifyAuthToken(req: Request): TokenResult {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: ERROR_MESSAGES.TOKEN_ERROR.ko };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { payload: decoded };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: ERROR_MESSAGES.EXPIRED_TOKEN.ko };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { error: ERROR_MESSAGES.INVALID_TOKEN.ko };
    } else {
      return { error: ERROR_MESSAGES.TOKEN_ERROR.ko };
    }
  }
}
