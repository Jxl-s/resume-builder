import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import i18nConfig from "./i18n/config.json";

// Can be imported from a shared config
const locales = i18nConfig.map(({ code }) => code);
export default getRequestConfig(async ({ locale }) => {
    if (!locales.includes(locale as any)) notFound();

    return {
        messages: (await import(`./i18n/messages/${locale}.ts`)).default,
    };
});
