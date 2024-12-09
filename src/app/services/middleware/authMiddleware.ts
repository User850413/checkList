'use server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import axios from 'axios';
import http, { IncomingMessage, request, ServerResponse } from 'http';

const parseCookies = (cookieHeader: string): Record<string, string> => {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [key, value] = cookie.split('=').map((part) => part.trim());
    cookies[key] = decodeURIComponent(value || '');
    return cookies;
  }, {} as Record<string, string>);
};

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const originalCookies = req.headers.cookie || '';
    const cookies = parseCookies(originalCookies);
    const accessToken = cookies['accessToken'];
    if (!accessToken) {
      res.writeHead(401, { 'Content-type': 'application/json' });
      res.end(JSON.stringify({ error: ERROR_MESSAGES.TOKEN_ERROR.ko }));
      return;
    }

    const modifiedHeaders = {
      ...req.headers,
      authorization: `Bearer ${accessToken}`,
    };

    const options = {
      hostname: 'http://localhost:3000',
      port: 443,
      path: req.url,
      method: req.method,
      headers: modifiedHeaders,
    };

    const proxyReq = request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);

    proxyReq.on('error', (err) => {
      console.error('Error forwarding request:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });
  }
);

server.listen(3000, () => {
  console.log('Proxy server running at http://localhost:3000');
});
