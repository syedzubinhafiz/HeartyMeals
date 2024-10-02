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
      webURL:"",
      tinyMCEKey: "5xd0rqlwc0evl0pm1xyxcy0ztd40yr061ss8azv8um8694bu",
    },
  },
  plugins: [
    '~/plugins/toast.js'
  ],
})