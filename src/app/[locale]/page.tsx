import Editor from "@/app/[locale]/Editor";
import Button from "@/components/Button";
import Nav from "@/components/Nav";
import Tooltips from "@/components/Tooltips";
import { useTranslations } from "next-intl";
import {
    FaBold,
    FaUnderline,
    FaItalic,
    FaLink,
    FaDownload,
    FaCircleExclamation,
} from "react-icons/fa6";

export default function Home() {
    const t = useTranslations("Index");

    return (
        <main>
            <Nav />
            <section className="p-4 flex gap-4">
                <article className="h-full bg-dark1 rounded-lg p-4">
                    <h1 className="text-2xl font-semibold">
                        Document Settings
                    </h1>
                    <h1 className="text-2xl font-semibold">Margin Settings</h1>
                    <h1 className="text-2xl font-semibold">Font Sizes</h1>
                </article>
                <article className="bg-dark1 rounded-lg p-2 flex-grow flex flex-col items-center">
                    <Tooltips />
                    <Editor />
                </article>
                <article className="h-full bg-dark1 rounded-lg p-4">
                    <h1 className="text-2xl font-semibold">
                        Document Settings
                    </h1>
                    <h1 className="text-2xl font-semibold">Margin Settings</h1>
                    <h1 className="text-2xl font-semibold">Font Sizes</h1>
                </article>
            </section>
        </main>
    );
}
