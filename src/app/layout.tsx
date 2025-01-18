import type { Metadata } from 'next';

import './globals.css';
import Container from '@/components/layout/Container';
import { Provider as ChakraProvider } from '@/components/ui/provider';

import QueryProviders from './lib/react-query-client';

export const metadata: Metadata = {
  title: '체크리스트',
  description: '할 일을 체크하고, 모두와 함께 나눠봐요!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <QueryProviders>
          <ChakraProvider>
            <Container>{children}</Container>
          </ChakraProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
