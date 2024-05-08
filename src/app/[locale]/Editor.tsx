"use client";

import { FC, useEffect, useState } from "react";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import EducationItem, {
    EducationItemWithId,
} from "../../components/items/Education";
import EditableHeading from "../../components/EditableHeading";
import ExperienceItem, {
    ExperienceItemWithId,
} from "@/components/items/Experience";
import { v4 as uuidv4 } from "uuid";
import Section from "@/components/Section";
import { IEducationItem } from "@/types/items";

const Editor: FC = () => {
    const sections = useResumeEditorStore((state) => state.sections);
    const setSections = useResumeEditorStore((state) => state.setSections);
    const addSection = useResumeEditorStore((state) => state.addSection);
    const updateSection = useResumeEditorStore((state) => state.updateSection);

    useEffect(() => {
        setSections([
            {
                title: "<b>Education</b>",
                id: uuidv4(),
                items: [
                    {
                        id: uuidv4(),
                        type: "education",
                        value: {
                            school: "",
                            location: "",
                            degree: "",
                            date: "",
                        },
                    },
                ],
            },
            {
                title: "<b>Experience</b>",
                id: uuidv4(),
                items: [
                    {
                        id: uuidv4(),
                        type: "experience",
                        value: {
                            company: "",
                            location: "",
                            position: "",
                            dates: "",
                            description: [],
                        },
                    },
                ],
            },
        ]);
    }, [setSections]);

    console.log(JSON.stringify(sections));
    return (
        <div
            className="bg-white text-black p-4"
            style={{
                width: "595pt",
            }}
        >
            {sections.map((section) => (
                <Section
                    key={section.id}
                    title={section.title}
                    setTitle={(t) => updateSection(section.id, t)}
                >
                    {section.items.map((item) => {
                        if (item.type === "education") {
                            return (
                                <EducationItemWithId
                                    key={item.id}
                                    sectionId={section.id}
                                    itemId={item.id}
                                />
                            );
                        }

                        if (item.type === "experience") {
                            return (
                                <ExperienceItemWithId
                                    key={item.id}
                                    sectionId={section.id}
                                    itemId={item.id}
                                />
                            );
                        }
                    })}
                </Section>
            ))}
        </div>
    );
};

export default Editor;
