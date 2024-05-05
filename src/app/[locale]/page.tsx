import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("Index");

    return (
        <main className="w-full h-full grid grid-cols-12 p-4 gap-2">
            <h1>{t("description")}</h1>
        </main>
    );
}
