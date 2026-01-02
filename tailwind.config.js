/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexprime': {
          'cyan': '#00FFFF',
          'cyan-dim': '#0088AA',
          'blue': '#1e3a5f',
          'dark': '#0a0a0f',
          'darker': '#050508',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
