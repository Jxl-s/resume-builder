import Editor from "@/app/[locale]/Editor";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("Index");

    return (
        <main className="p-6 print:p-0">
            <Editor />
        </main>
    );
}
