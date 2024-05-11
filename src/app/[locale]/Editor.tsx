"use client";

import { FC, useEffect } from "react";
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

const Editor: FC = () => {
    const titleSize = useDocSettingsStore((state) => state.titleSize);
    const contentSize = useDocSettingsStore((state) => state.contentSize);

    const [name, setName] = useResumeEditorStore((state) => [
        state.name,
        state.setName,
    ]);

    const [subtitle, setSubtitle] = useResumeEditorStore((state) => [
        state.subtitle,
        state.setSubtitle,
    ]);

    const [contact, setContact] = useResumeEditorStore((state) => [
        state.contact,
        state.setContact,
    ]);

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
                width: "695pt",
            }}
        >
            <EditableItem
                content={name}
                setContent={setName}
                Component={"span"}
                defaultStyle={["bold"]}
                className="text-center block"
                fontSize={titleSize}
            />
            <EditableItem
                content={subtitle}
                setContent={setSubtitle}
                Component={"span"}
                defaultStyle={["italic"]}
                className="text-center block"
                fontSize={contentSize}
            />
            <EditableItem
                content={contact}
                setContent={setContact}
                Component={"span"}
                className="text-center block"
                fontSize={contentSize}
            />
            {sections.map((section, i) => (
                <Section
                    key={section.id}
                    sectionId={section.id}
                    title={section.title}
                    setTitle={(t) => updateSection(section.id, t)}
                >
                    {section.items.map((item, i) => {
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

                        if (item.type === "text") {
                            return (
                                <TextItemWithId
                                    key={item.id}
                                    itemId={item.id}
                                />
                            );
                        }

                        if (item.type === "project") {
                            return (
                                <ProjectItemWithId
                                    key={item.id}
                                    itemId={item.id}
                                />
                            );
                        }
                    })}
                </Section>
            ))}
            <Button
                onClick={() => addSection("<b></b>")}
                className="flex items-center justify-center gap-2 w-full text-sm"
            >
                <FaPlusCircle className="w-6 h-6" />
                <span className="font-semibold">Create new section</span>
            </Button>
        </div>
    );
};

export default Editor;
