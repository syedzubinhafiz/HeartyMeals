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
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      minWidth: {
        'touch': '44px', // Minimum touch target size
      },
      maxWidth: {
        'mobile': '425px',
        'tablet': '768px',
      },
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1rem' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.25rem' }],
        'base-mobile': ['1rem', { lineHeight: '1.5rem' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.75rem' }],
      },
      gridTemplateColumns: {
        'mobile-cards': '1fr',
        'tablet-cards': 'repeat(2, 1fr)',
        'desktop-cards': 'repeat(3, 1fr)',
      }
    },
  },
  plugins: [],
}

