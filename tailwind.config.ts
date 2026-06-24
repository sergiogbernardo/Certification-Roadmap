import type { Config } from 'tailwindcss';

// The roadmap colour-codes each security domain. Tailwind only ships classes it
// can see in the source, so every domain colour used dynamically is listed in
// `safelist` below — otherwise the JIT compiler would purge them.
const domainColors = [
  'sky', // foundations
  'violet', // grc
  'cyan', // network
  'indigo', // iam
  'rose', // offensive
  'amber', // defensive
  'blue', // cloud
  'fuchsia', // appsec
  'teal', // management
];

const domainSafelist = domainColors.flatMap((c) => [
  `text-${c}-300`,
  `text-${c}-400`,
  `bg-${c}-400`,
  `bg-${c}-400/10`,
  `bg-${c}-500/15`,
  `border-${c}-500/30`,
  `border-${c}-400/40`,
  `ring-${c}-400/40`,
  `shadow-${c}-500/20`,
  // Hover variants are built from dynamic strings, so they must be safelisted
  // explicitly — otherwise the JIT compiler never sees the literal class.
  `hover:text-${c}-300`,
  `hover:bg-${c}-400/10`,
  `hover:bg-${c}-500/15`,
]);

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: domainSafelist,
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#34d399', // emerald-400 — family brand colour
          soft: '#6ee7b7',
        },
        // The neutral palette and the accent greens are backed by CSS variables
        // so the whole UI flips between the dark "hacker" look and a light theme
        // without touching component classes. Values live in src/index.css.
        black: 'rgb(var(--c-black) / <alpha-value>)',
        slate: {
          100: 'rgb(var(--c-s100) / <alpha-value>)',
          200: 'rgb(var(--c-s200) / <alpha-value>)',
          300: 'rgb(var(--c-s300) / <alpha-value>)',
          400: 'rgb(var(--c-s400) / <alpha-value>)',
          500: 'rgb(var(--c-s500) / <alpha-value>)',
          600: 'rgb(var(--c-s600) / <alpha-value>)',
          700: 'rgb(var(--c-s700) / <alpha-value>)',
          800: 'rgb(var(--c-s800) / <alpha-value>)',
          900: 'rgb(var(--c-s900) / <alpha-value>)',
          950: 'rgb(var(--c-s950) / <alpha-value>)',
        },
        emerald: {
          300: 'rgb(var(--c-e300) / <alpha-value>)',
          400: 'rgb(var(--c-e400) / <alpha-value>)',
          500: 'rgb(var(--c-e500) / <alpha-value>)',
        },
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-live': 'pulse-live 1.4s ease-in-out infinite',
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
