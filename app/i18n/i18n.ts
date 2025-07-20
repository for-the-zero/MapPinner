import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

const translations = {
    'en': require('./en.json'),
    'zh-CN': require('./zh-CN.json'),
    'zh-Hans-CN': require('./zh-CN.json'),
};

const i18n = new I18n(translations);

i18n.locale = Localization.getLocales()[0]?.languageTag || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;