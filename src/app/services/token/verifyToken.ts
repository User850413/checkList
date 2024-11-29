import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenResult {
  payload?: object | string;
  error?: string;
}

export function verifyAuthToken(req: Request): TokenResult {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: '토큰이 제공되지 않았습니다.' };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { payload: decoded };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: '토큰이 만료되었습니다.' };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { error: '유효하지 않은 토큰입니다.' };
    } else {
      return { error: '토큰 검증 중 문제가 발생했습니다.' };
    }
  }
}
