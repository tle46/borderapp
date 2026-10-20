/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#211F1D',
          soft: '#5B564F',
        },
        paper: {
          DEFAULT: '#F6F3EC',
          raised: '#FFFFFF',
          sunken: '#EDE8DC',
        },
        line: '#DED7C6',
        brand: {
          DEFAULT: '#2F5D57',
          dark: '#213F3B',
          light: '#DCE8E5',
        },
        status: {
          low: '#3C8A5B',
          lowBg: '#E4F1E7',
          moderate: '#C98A1B',
          moderateBg: '#FBF0DA',
          high: '#C24A3D',
          highBg: '#FBE7E3',
          unknown: '#8B857A',
          unknownBg: '#EAE6DA',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.1rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(33, 31, 29, 0.06), 0 1px 1px rgba(33, 31, 29, 0.04)',
        pop: '0 8px 24px rgba(33, 31, 29, 0.16)',
      },
    },
  },
  plugins: [],
}
