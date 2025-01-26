/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {}, //Standard Tailwind theme wird verwendet
    },
    plugins: [require('daisyui')],
  };