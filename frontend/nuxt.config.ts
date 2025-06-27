// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  vite: {
    build: {
      sourcemap: false
    }
  },
  css: ['~/assets/css/main.css', 'vue-toast-notification/dist/theme-sugar.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@nuxt/image",
  ],
  runtimeConfig: {
    public: {
      baseURL: "http://localhost:8000",
      webURL: "",
      isDebug: true,
      tinyMCEKey: "5xd0rqlwc0evl0pm1xyxcy0ztd40yr061ss8azv8um8694bu",
    },
  },
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/toast.js'
  ],
});
