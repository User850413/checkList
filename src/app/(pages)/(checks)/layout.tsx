import Header from '@/components/layout/header';

export default function CheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header /> {children}
    </>
  );
}
