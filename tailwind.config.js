/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta del portafolio, tomada del diseño de Figma.
        // `muted` y `success-text` se oscurecieron un poco para cumplir contraste AA.
        cv: {
          accent: '#FFB400',
          'accent-soft': '#FFF4D9',
          ink: '#2B2B2B',
          muted: '#6B6B75',
          canvas: '#F0F0F6',
          line: '#E7E7EF',
          success: '#7EB942',
          'success-text': '#3B7A1E',
        },
      },
      boxShadow: {
        'cv-card': '0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px -18px rgba(16, 24, 40, 0.18)',
        'cv-lift': '0 2px 4px rgba(16, 24, 40, 0.05), 0 24px 48px -20px rgba(16, 24, 40, 0.28)',
      },
      keyframes: {
        'cv-pop': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'cv-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'cv-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'cv-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'cv-pop': 'cv-pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'cv-fade': 'cv-fade 0.3s ease-out both',
        'cv-blink': 'cv-blink 1s step-end infinite',
        'cv-float': 'cv-float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
