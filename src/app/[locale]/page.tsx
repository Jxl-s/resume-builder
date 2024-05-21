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
import LeftBar from "./LeftBar";
import { Suspense } from "react";
import RightBar from "./RightBar";

export default function Home() {
    const t = useTranslations("Index");

    return (
        <main>
            <Nav />
            <section
                className="p-4 flex gap-4"
                style={{
                    marginTop: "68px",
                }}
            >
                <LeftBar />
                <article className="bg-dark1 rounded-lg p-2 flex-grow flex flex-col items-center">
                    <Tooltips />
                    <Editor />
                </article>
                <RightBar />
            </section>
        </main>
    );
}
