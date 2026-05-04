import { Space_Grotesk, Manrope, Fraunces } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});

export const allFontVars = [
  spaceGrotesk.variable,
  manrope.variable,
  fraunces.variable,
].join(' ');
