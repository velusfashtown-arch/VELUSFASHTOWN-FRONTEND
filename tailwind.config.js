/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        ink: '#241b18',
        'warm-ink': '#442920',
        cream: '#f9f5ee',
        paper: '#fffdfa',
        sand: '#ece2d4',
        blush: '#dd9f91',
        terra: '#a74e3e',
        wine: '#6c2424',
        line: 'rgba(47, 31, 25, 0.16)',
        muted: '#756b65',
        primary: '#a74e3e',
        danger: '#b93b3b',
        card: '#fffdfa',
        text: '#241b18',
      },
      fontFamily: {
        sans: ['DM Sans', 'Arial', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
      },
      maxWidth: {
        page: '1530px',
      },
      keyframes: {
        'page-fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'gallery-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'accordion-in': {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-35%)' },
        },
        'success-pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'success-fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'confetti-fall': {
          '0%': { top: '-10px', opacity: '0', transform: 'rotate(0deg) scale(0)' },
          '10%': { opacity: '1', transform: 'rotate(72deg) scale(1)' },
          '90%': { opacity: '1' },
          '100%': { top: '100vh', opacity: '0', transform: 'rotate(720deg) scale(0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'admin-slide-in': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'admin-shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'admin-progress-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(350%)' },
        },
        'admin-row-fade': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'admin-modal-in': {
          from: { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'auth-fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'page-fade-in': 'page-fade-in 420ms ease',
        'gallery-fade-in': 'gallery-fade-in 320ms ease',
        'accordion-in': 'accordion-in 220ms ease',
        ticker: 'ticker 20s linear infinite',
        'success-pop': 'success-pop 0.5s ease',
        'success-fade-in': 'success-fade-in 0.5s ease',
        'confetti-fall': 'confetti-fall 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'admin-slide-in': 'admin-slide-in 0.2s ease',
        'admin-shimmer': 'admin-shimmer 1.3s linear infinite',
        'admin-progress-slide': 'admin-progress-slide 0.9s ease-in-out infinite',
        'admin-row-fade': 'admin-row-fade 0.25s ease',
        'admin-modal-in': 'admin-modal-in 0.2s ease',
        'auth-fade-up': 'auth-fade-up 0.6s ease',
      },
    },
  },
  plugins: [],
};
