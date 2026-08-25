import { DeviceHelperPlugin } from "@contena/meteor-component-library";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DeviceHelperPlugin);
});
