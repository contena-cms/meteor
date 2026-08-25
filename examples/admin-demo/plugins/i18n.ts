import { createI18n } from "vue-i18n";

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: "zh-CN",
    fallbackLocale: "zh-CN",
    messages: {
      "zh-CN": {
        light: "亮色",
        dark: "暗色",
        system: "跟随系统",
        common: { search: "搜索", save: "保存", cancel: "取消", delete: "删除" },
      },
      zh: {
        light: "亮色",
        dark: "暗色",
        system: "跟随系统",
      },
    },
  });

  nuxtApp.vueApp.use(i18n);
});
