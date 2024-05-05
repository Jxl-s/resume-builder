import createMiddleware from "next-intl/middleware";
import i18nConfig from "./i18n/config.json";

const locales = i18nConfig.map(({ code }) => code);
export default createMiddleware({
    // A list of all locales that are supported
    locales: locales,

    // Used when no locale matches
    defaultLocale: locales[0],
});

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
