import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RocketTurtle',
  description: 'Beginner-friendly GitHub repository understanding reports.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
