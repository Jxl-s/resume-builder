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
        <main className="m-0 p-0">
            <Nav />
            <section
                className="p-4 mt-[68px] flex gap-4 print:p-0 print:m-0"
            >
                <LeftBar />
                <article className="bg-dark1 rounded-lg p-2 print:p-0 flex-grow flex flex-col items-center">
                    <Tooltips />
                    <Editor />
                </article>
                <RightBar />
            </section>
        </main>
    );
}
