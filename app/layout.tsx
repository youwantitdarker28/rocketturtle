import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RocketTurtle | Understand Repositories Calmly',
  description: 'Beginner-friendly repository understanding reports for public GitHub repositories.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
