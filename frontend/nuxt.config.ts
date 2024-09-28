// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css','vue-toast-notification/dist/theme-sugar.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ["@nuxt/image"],
  runtimeConfig: {
    public: {
      greensheartAccountIssuer: "https://accounts.greensheart.com/realms/greensheart",
      greensheartAccountClientId: "greensheart",
      greensheartAccountScope: "openid profile email",
      baseURL: "http://localhost:3001",
      webURL:"",
    },
  },
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/toast.js'
  ],
})