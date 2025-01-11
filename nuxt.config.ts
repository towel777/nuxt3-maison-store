export default defineNuxtConfig({
  compatibilityDate: '2024-07-01',
  devtools: { enabled: true },

  srcDir: 'src/',

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
  ],

  routeRules: {
    '/':             { isr: 60 },
    '/products/**':  { isr: 300, swr: true },
    '/checkout':     { ssr: false },
    '/orders':       { ssr: true },
    '/profile':      { ssr: false },
    '/api/**':       { cors: true },
  },

  runtimeConfig: {
    public: {
      apiBase: '/api',
      appName: 'Maison',
      currency: 'RUB',
      freeShippingThreshold: 5000,
      shippingCost: 490,
    },
  },

  pinia: {
    storesDirs: ['./src/**/model/**'],
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  image: {
    quality: 80,
    formats: ['webp', 'avif'],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  css: ['~/app/styles/global.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/app/styles/variables" as *;',
        },
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'MAISON — Интернет-магазин',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Интернет-магазин премиальных товаров для дома и гардероба' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  nitro: {
    compressPublicAssets: true,
  },
})
