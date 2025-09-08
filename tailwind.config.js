/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        primary: '#2CE8A2',
        error: '#FF4D4D',
        background: '#0a0a0a',
      },
      boxShadow: {
        pixel: '4px 4px 0px rgba(0, 0, 0, 0.8)',
        pixelInset: 'inset 4px 4px 0px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}