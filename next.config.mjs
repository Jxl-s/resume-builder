import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            "pdf-parse",
            "puppeteer",
            "puppeteer-core",
            "chrome-aws-lambda",
        ],
    },
};

export default withNextIntl(nextConfig);
