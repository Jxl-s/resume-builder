import { FC, useState } from "react";
import Button from "../Button";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { FaDownload } from "react-icons/fa";

const DownloadResume: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const onDownload = async () => {
        setIsDownloading(true);
        const header = useResumeEditorStore.getState().header;
        const sections = useResumeEditorStore.getState().sections;

        const resume = await fetch("/api/export_pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                header,
                sections,
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
            {isDownloading ? "Please wait..." : "Download"}
        </Button>
    );
};

export default DownloadResume;