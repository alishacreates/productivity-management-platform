import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../lib/ThemeContext';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
});

export const metadata = {
  title: 'Productivity Platform',
  description: 'Manage tasks, habits, goals, and focus sessions in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
