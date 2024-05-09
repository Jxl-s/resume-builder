import Editor from "@/app/[locale]/Editor";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("Index");

    return (
        <main className="p-6">
            <h1>{t("description")}</h1>
            <h1>Something</h1>
            <Editor />
        </main>
    );
}
