/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg-green': '#015B59',
        'custom-bg-brown': '#DAC2A8',
        'custom-overlay-brown': '#F3EADA',
        'custom-overlay-light': '#FFFEF1',
        'custom-button-orange': '#FFA17A',
        'custom-button-green': '#87A98D',
        'custom-text-orange': '#993300',
      },
    },
  },
  plugins: [],
}

