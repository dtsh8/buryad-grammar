/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        buryat: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        // Noto Sans Mono has һ ү ө; system monospace fonts (Consolas, Menlo) mostly don't,
        // which garbled suffixes such as -һан in code-styled text.
        mono: ['"Noto Sans Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        buryat: {
          50:  '#fdf8f0',
          100: '#faefd8',
          200: '#f3d9a0',
          300: '#eabd62',
          400: '#e0a030',
          500: '#c8851a',
          600: '#a86812',
          700: '#8a4f0f',
          800: '#703e12',
          900: '#5c3313',
        },
        mongol: {
          50:  '#f0f7ff',
          100: '#e0effe',
          200: '#baddfd',
          300: '#7cc3fc',
          400: '#38a5f8',
          500: '#0e88ea',
          600: '#0268c8',
          700: '#0353a2',
          800: '#074785',
          900: '#0c3d6e',
        },
      },
    },
  },
  plugins: [],
}

