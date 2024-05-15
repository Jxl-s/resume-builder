"use client";

import { FC, useEffect, useRef } from "react";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { EducationItemWithId } from "../../components/items/Education";
import { ExperienceItemWithId } from "@/components/items/Experience";
import Section from "@/components/Section";
import { FaPlusCircle } from "react-icons/fa";
import Button from "@/components/Button";
import TextItem, { TextItemWithId } from "@/components/items/Text";
import { ProjectItemWithId } from "@/components/items/Project";
import EditableItem from "@/components/EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import Header from "@/components/items/Header";
import useStylingStore from "@/stores/useStylingStore";
import Modal from "@/components/Modal";
import "./Editor.css";
import fonts from "../fonts";

const Editor: FC = () => {
    const sections = useResumeEditorStore((state) => state.sections);

    const setSections = useResumeEditorStore((state) => state.setSections);
    const addSection = useResumeEditorStore((state) => state.addSection);
    const updateSection = useResumeEditorStore((state) => state.updateSection);

    const font = useDocSettingsStore((state) => state.font);

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
        <div className={`bg-white text-black w-[612pt] rounded-lg`} style={fonts[font].style}>
            <div
                style={{
                    marginTop: "10mm",
                    marginBottom: "10mm",
                    marginLeft: "10mm",
                    marginRight: "10mm",
                }}
            >
                <Header />
                {sections.map((section, i) => (
                    <Section
                        key={section.id}
                        sectionId={section.id}
                        title={section.title}
                        setTitle={(t) => updateSection(section.id, t)}
                    >
                        {section.items.map((item, i) => {
                            if (item.type === "education") {
                                return <EducationItemWithId key={item.id} itemId={item.id} />;
                            }

                            if (item.type === "experience") {
                                return <ExperienceItemWithId key={item.id} itemId={item.id} />;
                            }

                            if (item.type === "text") {
                                return <TextItemWithId key={item.id} itemId={item.id} />;
                            }

                            if (item.type === "project" || item.type === "project-nolinks") {
                                return <ProjectItemWithId key={item.id} itemId={item.id} />;
                            }
                        })}
                    </Section>
                ))}
                <Button
                    onClick={() => addSection("<b></b>")}
                    className="flex items-center justify-center gap-2 w-full text-sm print:hidden mt-4"
                >
                    <FaPlusCircle className="w-4 h-4" />
                    <span className="font-semibold py-2">Add a New Section</span>
                </Button>
            </div>
        </div>
    );
};

export default Editor;
