import type { Config } from 'tailwindcss';

/**
 * EduTrust-Chain design tokens.
 *
 * Palette is anchored on the Nigerian national green (#1B7339, the verified
 * flag green) which NITDA's identity is built around, extended into a full
 * tint/shade ramp plus a gold secondary for emphasis and a neutral ink ramp.
 * See docs/BRAND.md for usage rules and for how to swap in the official
 * NITDA brand-guideline values when the agency supplies them.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nitda: {
          50: '#ECF7F0',
          100: '#D2EDDC',
          200: '#A6DBB9',
          300: '#70C492',
          400: '#3FA96C',
          500: '#1B7339',
          600: '#156030',
          700: '#104C26',
          800: '#0B381C',
          900: '#072413',
          950: '#04170C',
        },
        accent: {
          50: '#E6FAF0',
          100: '#C0F2D9',
          300: '#5FDCA2',
          500: '#00A859',
          600: '#008C4A',
          700: '#00703B',
        },
        gold: {
          50: '#FDF7E7',
          100: '#F9EAC0',
          300: '#F0CC6B',
          500: '#E2A32B',
          600: '#C4861A',
          700: '#9A6611',
        },
        ink: {
          50: '#F7F9F8',
          100: '#EDF1EF',
          200: '#DCE3E0',
          300: '#BCC7C2',
          400: '#8D9C96',
          500: '#64736D',
          600: '#4A5853',
          700: '#36423D',
          800: '#232C28',
          900: '#141A17',
        },
        chain: '#5B4BD6',
        enaira: '#00843D',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,26,23,.04), 0 8px 24px -12px rgba(20,26,23,.12)',
        pop: '0 12px 40px -12px rgba(20,26,23,.28)',
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem' },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-up': 'fade-up .35s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
