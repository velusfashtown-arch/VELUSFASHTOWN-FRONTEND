/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1e1b18',
        'warm-ink': '#442920',
        cream: '#faf7f2',
        paper: '#ffffff',
        sand: '#f0e9df',
        blush: '#dd9f91',
        terra: '#a74e3e',
        wine: '#6c2424',
        line: 'rgba(30, 27, 24, 0.1)',
        muted: '#6b6259',
        primary: '#a74e3e',
        danger: '#b93b3b',
        card: '#ffffff',
        text: '#1e1b18',
        // Admin-specific professional palette
        admin: {
          bg: '#f6f7f9',
          surface: '#ffffff',
          border: '#e5e7eb',
          text: '#111827',
          muted: '#6b7280',
          primary: '#4f46e5',
          'primary-hover': '#4338ca',
          'primary-light': '#eef2ff',
          success: '#059669',
          'success-light': '#ecfdf5',
          warning: '#d97706',
          'warning-light': '#fffbeb',
          danger: '#dc2626',
          'danger-light': '#fef2f2',
          info: '#2563eb',
          'info-light': '#eff6ff',
          sidebar: '#0f172a',
          'sidebar-hover': '#1e293b',
          'sidebar-active': '#4f46e5',
          'sidebar-text': '#94a3b8',
          'sidebar-text-active': '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'Arial', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
      },
      maxWidth: {
        page: '1530px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'modal': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        'dropdown': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
        'sidebar': '4px 0 20px rgba(0,0,0,0.08)',
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
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
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
        'fade-in': 'fade-in 0.3s ease',
        'slide-up': 'slide-up 0.4s ease',
        'scale-in': 'scale-in 0.2s ease',
      },
    },
  },
  plugins: [],
};