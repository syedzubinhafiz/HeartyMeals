// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  sourcemap: {
    server: false,
    client: false,
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
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
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
      baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
      webURL: "",
      isDebug: true,
      tinyMCEKey: "5xd0rqlwc0evl0pm1xyxcy0ztd40yr061ss8azv8um8694bu",
    },
  },
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/toast.js'
  ],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' }
      ]
    }
  },
});
