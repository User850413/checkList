import type { Metadata } from 'next';
import './globals.css';
import QueryProviders from './lib/react-query-client';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import Container from '@/components/common/Container';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
