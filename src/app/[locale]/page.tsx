import EditableLabel from "@/components/EditableLabel";
import Editor from "@/components/Editor";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Home() {
    const t = useTranslations("Index");

    return (
        <main className="p-4">
            <h1>{t("description")}</h1>
            <Editor />
        </main>
    );
}
