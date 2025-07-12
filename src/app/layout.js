// src/app/layout.js
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { Poppins, Bebas_Neue, Dancing_Script } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const bebas_neue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const dancing_script = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing-script',
  display: 'swap',
});

export const metadata = {
  title: 'Shreyansh',
  description: 'Personal animated portfolio of Shreyansh',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${bebas_neue.variable} ${dancing_script.variable} ${poppins.className}`}
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}