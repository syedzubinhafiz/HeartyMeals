// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      greensheartAccountIssuer: "https://accounts.greensheart.com/realms/greensheart",
      greensheartAccountClientId: "greensheart",
      greensheartAccountScope: "openid profile email",
      webURL:"",
    },
  },
})
