export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2026-08-25",
  experimental: { viteEnvironmentApi: true },
  devtools: { enabled: false },
  css: [
    "@contena/meteor-component-library/styles.css",
    "@contena/meteor-component-library/font.css",
    "~/assets/css/main.scss",
  ],
  typescript: { strict: true, typeCheck: true },
  app: {
    head: {
      htmlAttrs: { lang: "zh-CN", translate: "no" },
      title: "星云内容中台",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "google", content: "notranslate" },
        { "http-equiv": "Content-Language", content: "zh-CN" },
      ],
    },
  },
});
