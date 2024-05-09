"use client";

import { FC, useEffect } from "react";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { EducationItemWithId } from "../../components/items/Education";
import { ExperienceItemWithId } from "@/components/items/Experience";
import Section from "@/components/Section";
import { FaPlusCircle } from "react-icons/fa";

const Editor: FC = () => {
    const sections = useResumeEditorStore((state) => state.sections);
    const setSections = useResumeEditorStore((state) => state.setSections);
    const addSection = useResumeEditorStore((state) => state.addSection);
    const updateSection = useResumeEditorStore((state) => state.updateSection);

    useEffect(() => {
        const savedSections = window.localStorage.getItem("sections");
        if (savedSections) {
            setSections(JSON.parse(savedSections));
        }
    }, [setSections]);

    useEffect(() => {
        if (sections.length > 0) {
            window.localStorage.setItem("sections", JSON.stringify(sections));
        }
    }, [sections]);

    return (
        <div
            className="bg-white text-black p-8"
            style={{
                width: "595pt",
            }}
        >
            {sections.map((section) => (
                <Section
                    key={section.id}
                    sectionId={section.id}
                    title={section.title}
                    setTitle={(t) => updateSection(section.id, t)}
                >
                    {section.items.map((item) => {
                        if (item.type === "education") {
                            return (
                                <EducationItemWithId
                                    key={item.id}
                                    itemId={item.id}
                                />
                            );
                        }

                        if (item.type === "experience") {
                            return (
                                <ExperienceItemWithId
                                    key={item.id}
                                    itemId={item.id}
                                />
                            );
                        }
                    })}
                </Section>
            ))}
            <button
                onClick={() => addSection("<b></b>")}
                className="flex items-center bg-primary text-white gap-2 w-full rounded-md justify-center py-2 mt-4 shadow-md hover:brightness-110 duration-300"
            >
                <FaPlusCircle className="w-6 h-6" />
                <span className="font-semibold">Create new section</span>
            </button>
        </div>
    );
};

export default Editor;
