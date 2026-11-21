import type { Config } from 'tailwindcss';

/**
 * Tokens da Salvador Diversões.
 * Os valores ficam em src/index.css (variáveis CSS em RGB, claro e escuro).
 * `colors` substitui a paleta padrão do Tailwind: só existem as cores da marca.
 * Assim, `bg-white` ou `text-gray-500` nem compilam.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  surface: token('surface'),
  /** Faixa amarelo-clara suave (substitui as faixas amarelas cheias). */
  'surface-alt': token('surface-alt'),
  'surface-raised': token('surface-raised'),
  ink: token('ink'),
  'ink-muted': token('ink-muted'),
  line: token('line'),
  sun: token('sun'),
  'on-sun': token('on-sun'),
  navy: token('navy'),
  'on-navy': token('on-navy'),
  sky: token('sky'),
  'cap-red': token('cap-red'),
  'on-cap-red': token('on-cap-red'),
  honey: token('honey'),
  leaf: token('leaf'),
  pink: token('pink'),
  grape: token('grape'),
  whatsapp: token('whatsapp'),
  'on-whatsapp': token('on-whatsapp'),
  /** Fundo do chip do logo: branco no claro, creme no escuro. */
  chip: token('chip'),
};

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    colors,
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Jakarta Fallback"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Jakarta Fallback"', 'system-ui', 'sans-serif'],
        /** Fonte pixelada, recortada só para dígitos (index.html): só a numeração do FAQ. Nunca em texto corrido. */
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        h1: ['clamp(36px, 5.2vw, 56px)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h2: ['clamp(28px, 3.6vw, 40px)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        heading: ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        'body-lg': ['18px', { lineHeight: '29px' }],
        body: ['16px', { lineHeight: '26px' }],
        label: ['14px', { lineHeight: '20px' }],
        caption: ['13px', { lineHeight: '18px' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        pill: '999px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      maxWidth: {
        page: '1200px',
      },
      /** Letreiro (Marquee.tsx): a faixa tem o conteúdo duplicado e anda metade da largura. A duração vem de --duration. */
      animation: {
        marquee: 'marquee var(--duration, 30s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration, 30s) linear infinite',
      },
      keyframes: {
        marquee: {
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
