import { NextRequest, NextResponse } from 'next/server';
import ERROR_MESSAGES from './app/lib/constants/errorMessages';

export function middleware(req: NextRequest) {
  console.log(
    `---------middleWare working on ${req.nextUrl.pathname}---------`
  );
  const accessToken = req.cookies.get('accessToken');
  const refreshToken = req.cookies.get('refreshToken');

  //NOTE : accessToken을 필요로 하지 않는 route 경로
  const unAuthorizedPath = [
    '/api/register',
    '/api/login',
    '/api/logout',
    '/api/refresh',
  ];
  const isAuthorizationRequired = !unAuthorizedPath.some((path) =>
    req.nextUrl.pathname.includes(path)
  );
  console.log(isAuthorizationRequired);

  console.log(req.nextUrl.pathname);
  console.log('--------');

  //NOTE: accessToken 검증
  if (isAuthorizationRequired) {
    console.log('--------isAuthorizationRequired');
    if (accessToken) {
      console.log('--------accessToken');

      const decodedValue = `Bearer ${decodeURIComponent(accessToken.value)}`;

      const response = NextResponse.next();
      response.headers.set('Authorization', decodedValue);

      // if (refreshToken) {
      //   response.cookies.set('refreshToken', '', { maxAge: 0 }); // 쿠키 삭제
      // }

      return response;
    }
    console.log('--------not isAuthorizationRequired');

    return NextResponse.json(
      { error: ERROR_MESSAGES.INVALID_TOKEN.ko },
      { status: 401 }
    );
  } else {
    console.log('else');
    console.log(refreshToken);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/api/:path*', '/api/:path*/:path*'],
};
