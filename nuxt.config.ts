// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '@fortawesome/fontawesome-free/css/all.min.css',
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    public: {
      // Override with NUXT_PUBLIC_API_BASE
      apiBase: 'http://localhost:8000/api',
    },
  },

  app: {
    head: {
      title: 'OnlyWeebs',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/favicon.png' },
      ],
      script: [
        {
          // Applies the saved theme before first paint to avoid a flash.
          innerHTML: `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}`,
          tagPosition: 'head',
        },
      ],
    },
  },
})
