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
    screens: {
      'xs': '320px',     // mobile-small
      'sm': '375px',     // mobile
      'md': '425px',     // mobile-large
      'lg': '768px',     // tablet
      'xl': '1024px',    // laptop
      '2xl': '1440px',   // desktop
      '3xl': '1920px',   // desktop-large
      '4xl': '2560px',   // desktop-4k
    },
    extend: {
      colors: {
        'custom-bg-green': '#015B59',
        'custom-bg-lightgreen': '#427573',
        'custom-bg-brown': '#DAC2A8',
        'custom-overlay-brown': '#F3EADA',
        'custom-overlay-light': '#FFFEF1',
        'custom-button-orange': '#FFA17A',
        'custom-button-orange-dark': '#E5946B',
        'custom-button-green': '#87A98D',
        'custom-text-orange': '#993300',
        'custom-sidebar-yellow': '#B8B396'
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size
      },
      minWidth: {
        'touch': '44px', // Minimum touch target size
      }
    },
  },
  plugins: [],
}

