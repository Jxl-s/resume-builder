import { FC, useState } from "react";
import Button from "../Button";
import { FaFileImport } from "react-icons/fa";
import Modal from "../Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { v4 as uuidv4 } from "uuid";

const ImportResume: FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [file, setFile] = useState<string>("");
    const setHeader = useResumeEditorStore((state) => state.setHeader);
    const setSections = useResumeEditorStore((state) => state.setSections);

    return (
        <>
            <Modal
                title="Import Resume"
                onClose={() => setShowModal(false)}
                visible={showModal}
            >
                <p>Paste the text from the resume to import</p>
                <input
                    type="text"
                    className="block w-full bg-dark3 disabled:opacity-50 rounded-md py-1 mt-2"
                    onChange={(e) => setFile(e.target.value)}
                    disabled={isUploading}
                />
                <Button
                    theme="primary"
                    className="py-2 w-full mt-2"
                    disabled={file === null || isUploading}
                    onClick={async () => {
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("file", file);
                        setIsUploading(true);

                        let resJson;
                        try {
                            const res = await fetch("/api/extract_resume", {
                                method: "POST",
                                body: file,
                            });
    
                            setIsUploading(false);
                            resJson = await res.json();
                        } catch (e) {
                            console.error(e);
                            setIsUploading(false);
                            return;
                        }
                        
                        // Now set some fields
                        setHeader({
                            name: `<b>${resJson.name}</b>`,
                            subtitle: "<i>Software Engineer</i>",
                            contact: `${resJson.phone} | ${resJson.email}`,
                        });

                        setSections([
                            {
                                id: uuidv4(),
                                title: "Education",
                                items: resJson.education.map((edu: any) => ({
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
                                items: resJson.experience.map((exp: any) => ({
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
                                items: resJson.projects.map((exp: any) => ({
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
                                            text: resJson.skills.join(", "),
                                        },
                                    },
                                ],
                            },
                        ]);

                        console.log(resJson);
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
