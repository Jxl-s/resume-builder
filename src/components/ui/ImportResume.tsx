import { FC, useState } from "react";
import Button from "../Button";
import { FaFileImport } from "react-icons/fa";
import Modal from "../Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { v4 as uuidv4 } from "uuid";

const ImportResume: FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState<string>("");
    const [usingText, setUsingText] = useState(false);

    const setHeader = useResumeEditorStore((state) => state.setHeader);
    const setSections = useResumeEditorStore((state) => state.setSections);

    return (
        <>
            <Modal
                title="Import Resume"
                onClose={() => setShowModal(false)}
                visible={showModal}
            >
                <p>Select the PDF to be imported</p>
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
                    or, paste the text from your resume
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
                    onClick={async () => {
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
                            if (res.status !== 200)
                                throw new Error("Failed to import resume");

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
                                items: resumeData.experience.map(
                                    (exp: any) => ({
                                        type: "experience",
                                        id: uuidv4(),
                                        value: {
                                            company: `<i>${exp.company}</i>`,
                                            location: `<i>${exp.location}</i>`,
                                            position: `<b>${exp.job_title}</b>`,
                                            dates: `<b>${exp.start_date} - ${exp.end_date}</b>`,
                                            description: exp.description,
                                        },
                                    })
                                ),
                            },
                            {
                                id: uuidv4(),
                                title: "Projects",
                                items: resumeData.projects.map((exp: any) => ({
                                    type: "project",
                                    id: uuidv4(),
                                    value: {
                                        name: `<b>${exp.name}</b>`,
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
                                            text: resumeData.skills.join(", "),
                                        },
                                    },
                                ],
                            },
                        ]);

                        console.log(resumeData);
                        setShowModal(false);
                    }}
                >
                    Import
                </Button>
            </Modal>

            <Button
                theme="secondary"
                className="text-sm font-semibold px-5 flex items-center gap-2"
                onClick={() => setShowModal(true)}
            >
                <FaFileImport className="w-4 h-4" />
                Import
            </Button>
        </>
    );
};

export default ImportResume;
