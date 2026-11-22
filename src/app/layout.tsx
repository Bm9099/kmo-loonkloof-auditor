import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'KMO Loonkloof- & Transparantie Auditor',
  description:
    'Klaar voor de EU-Richtlijn Loontransparantie (2027) in 2 minuten. Analyseer loonkloven en genereer compliance-rapporten.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #0F172A 0%, #0D2436 30%, #083344 60%, #042f2e 100%)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
