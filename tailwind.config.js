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
    },
  },
  plugins: [],
};
