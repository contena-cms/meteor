import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { componentMap } from './locations';
import { location, context } from '@contena/meteor-admin-sdk';
import enGb from '../snippet/en-GB.json';
import zhCn from '../snippet/zh-CN.json';

// Importing styles
import '@contena/meteor-component-library/styles.css';
import '@contena/meteor-component-library/font.css';
import './assets/main.css';

export default async function runApp() {
    // Trigger auto-resizer for the iframe
    location.startAutoResizer();

    // Handle the location ID
    const currentLocationId = location.get();
    const selectedLocation = componentMap[currentLocationId];

    if (!selectedLocation) {
        console.error(`No component found for location ID: ${currentLocationId}`);
        return;
    }

    // Get the current locale
    const { locale, fallbackLocale } = await context.getLocale();

    // Create Vue instance for the selected location
    const i18n = createI18n({
        legacy: false,
        locale,
        fallbackLocale,
        messages: {
            'en-GB': enGb,
            'zh-CN': zhCn,
        },
    });

    // Subscribe to locale changes
    context.subscribeLocale(({ locale, fallbackLocale }) => {
        i18n.global.locale.value = locale as 'en-GB' | 'zh-CN';
        i18n.global.fallbackLocale.value = fallbackLocale as 'en-GB' | 'zh-CN';
    });

    // Create the Vue app with the selected component for the location
    const app = createApp(selectedLocation);
    app.use(i18n);

    // Mount the app to the DOM
    app.mount('#app');
}
