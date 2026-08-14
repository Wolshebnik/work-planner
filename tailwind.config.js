/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#004B71',
        button: '#00658F',
        neutral: '#E7E8EB',
        border: '#C8D5E0',
        success: '#18B978',
        danger: '#EF4444',
        warning: '#F6B800',
        maroon: '#8F1F2E',
        purple: '#7C4DDB',
        'blue-light': '#D0E2F3',
      },
      borderRadius: {
        6: '6px',
        8: '8px',
        12: '12px',
      },
      fontFamily: {
        sans: ['RobotoFlex_400Regular'],
        regular: ['RobotoFlex_400Regular'],
        medium: ['RobotoFlex_500Medium'],
        semibold: ['RobotoFlex_600SemiBold'],
        bold: ['RobotoFlex_700Bold'],
        extrabold: ['RobotoFlex_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
