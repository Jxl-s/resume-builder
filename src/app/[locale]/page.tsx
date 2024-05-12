import Editor from "@/app/[locale]/Editor";
import Button from "@/components/Button";
import Nav from "@/components/Nav";
import { useTranslations } from "next-intl";
import { FaBold, FaUnderline, FaItalic, FaLink } from "react-icons/fa6";

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
                <article className="h-full bg-dark1 rounded-lg p-2">
                    <div className="flex gap-2 mb-2">
                        <div className="rounded-lg bg-dark3 p-2">
                            <FaBold className="w-4 h-4" />
                        </div>
                        <div className="rounded-lg bg-dark3 p-2">
                            <FaItalic className="w-4 h-4" />
                        </div>
                        <div className="rounded-lg bg-dark3 p-2">
                            <FaUnderline className="w-4 h-4" />
                        </div>
                        <div className="rounded-lg bg-dark3 p-2">
                            <FaLink className="w-4 h-4" />
                        </div>
                    </div>
                    <Editor />
                </article>
            </section>
        </main>
    );
}
