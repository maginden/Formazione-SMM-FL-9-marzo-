import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Formula Lab - Social Media Marketing',
  description: 'Lezione interattiva su Piano e Calendario Editoriale',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#fdfdfd] text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
