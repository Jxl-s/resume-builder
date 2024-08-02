import { FC, useEffect, useState } from "react";
import Button from "../Button";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { FaDownload } from "react-icons/fa";
import useDocSettingsStore from "../../stores/useDocSettingsStore";
import { useTranslations } from "next-intl";

const DownloadResume: FC<{ enabled: boolean }> = ({ enabled }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const t = useTranslations("ToolBar");

    const onDownload = async () => {
        setIsDownloading(true);

        if (!enabled) {
            // do a browser print
            window.print();
            setIsDownloading(false);
            return;
        }

        const { header, sections } = useResumeEditorStore.getState();
        const {
            font,
            spacing,
            titleSize,
            headingSize,
            contentSize,
            marginBottom,
            marginLeft,
            marginRight,
            marginTop,
        } = useDocSettingsStore.getState();

        const resume = await fetch("/api/resume/export", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                header,
                sections,
                settings: {
                    font,
                    spacing,
                    titleSize,
                    headingSize,
                    contentSize,

                    marginBottom,
                    marginLeft,
                    marginRight,
                    marginTop,
                },
            }),
        });

        setIsDownloading(false);
        if (resume.status !== 200) {
            console.error("Failed to download resume");
            return;
        }

        const blob = await resume.blob();

        // save it now
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <Button
            theme="primary"
            disabled={isDownloading}
            className="text-sm font-semibold px-5 flex items-center gap-2"
            onClick={onDownload}
        >
            <FaDownload className="w-4 h-4" />
            {isDownloading ? t("please_wait") : t("download")}
        </Button>
    );
};

export default DownloadResume;
