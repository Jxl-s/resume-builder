import { FC, useState } from "react";
import Modal from "../Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import Button from "../Button";
import { v4 as uuidv4 } from "uuid";
import { useTranslations } from "next-intl";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const ImportModal: FC<Props> = ({ visible, onClose }) => {
    const t = useTranslations("ImportModal");

    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState<string>("");
    const [usingText, setUsingText] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const setHeader = useResumeEditorStore((state) => state.setHeader);
    const setSections = useResumeEditorStore((state) => state.setSections);

    const reset = () => {
        setFile(null);
        setText("");
        setUsingText(false);
        onClose();
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (usingText) {
            if (text === "") return;
            formData.append("text", text);
        } else {
            if (!file) return;
            formData.append("file", file);
        }

        setIsUploading(true);

        let resumeData;
        try {
            const res = await fetch("/api/resume/import", {
                method: "POST",
                body: formData,
            });

            setIsUploading(false);
            if (res.status !== 200) throw new Error("Failed to import resume");

            const resJson = await res.json();
            resumeData = resJson.data;
        } catch (e) {
            console.error(e);
            setIsUploading(false);
            return;
        }

        // Now set some fields
        setHeader({
            name: `<b>${resumeData.name}</b>`,
            subtitle: "<i>Software Engineer</i>",
            contact: `${resumeData.phone} | ${resumeData.email}`,
        });

        setSections([
            {
                id: uuidv4(),
                title: "Education",
                items: resumeData.education.map((edu: any) => ({
                    type: "education",
                    id: uuidv4(),
                    value: {
                        school: `<b>${edu.school}</b>`,
                        location: `<i>${edu.location}</i>`,
                        degree: `<i>${edu.degree}</i>`,
                        date: `<b>${edu.grad_month_year}</b>`,
                    },
                })),
            },
            {
                id: uuidv4(),
                title: "Experience",
                items: resumeData.experience.map((exp: any) => ({
                    type: "experience",
                    id: uuidv4(),
                    value: {
                        company: `<i>${exp.company}</i>`,
                        location: `<i>${exp.location}</i>`,
                        position: `<b>${exp.job_title}</b>`,
                        dates: `<b>${exp.start_date} - ${exp.end_date}</b>`,
                        description: exp.description,
                    },
                })),
            },
            {
                id: uuidv4(),
                title: "Projects",
                items: resumeData.projects.map((exp: any) => ({
                    type: "project",
                    id: uuidv4(),
                    value: {
                        name: `<b>${exp.title}</b>`,
                        dates: `<b>${exp.start_date} - ${exp.end_date}</b>`,
                        technologies: "",
                        source: "",
                        demo: "",
                        description: exp.description,
                    },
                })),
            },
            {
                id: uuidv4(),
                title: "Skills",
                items: [
                    {
                        type: "text",
                        id: uuidv4(),
                        value: {
                            text: resumeData.skills,
                        },
                    },
                ],
            },
        ]);

        reset();
    };

    return (
        <Modal title={t("title")} onClose={reset} visible={visible}>
            <p>{t("select_file")}</p>
            <input
                type="file"
                accept=".pdf"
                className="block w-full bg-dark3 disabled:opacity-50 rounded-md py-1 mt-2"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={isUploading || usingText}
            />
            <p>
                <input
                    type="checkbox"
                    className="me-2"
                    checked={usingText}
                    onChange={(e) => setUsingText(e.target.checked)}
                />
                {t("paste_resume")}
            </p>
            <input
                type="text"
                className="block w-full bg-dark3 disabled:opacity-50 rounded-md py-1 mt-2"
                onChange={(e) => setText(e.target.value)}
                disabled={isUploading || !usingText}
            />
            <Button
                theme="primary"
                className="py-2 w-full mt-2"
                disabled={(file === null && text === "") || isUploading}
                onClick={handleSubmit}
            >
                {t("import")}
            </Button>
        </Modal>
    );
};

export default ImportModal;
