"use client";

import { FC, useEffect, useState } from "react";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { EducationItemWithId } from "../../components/items/Education";
import EditableHeading from "../../components/EditableHeading";
import { ExperienceItemWithId } from "@/components/items/Experience";
import { v4 as uuidv4 } from "uuid";

const Editor: FC = () => {
    const sections = useResumeEditorStore((state) => state.sections);
    const setSections = useResumeEditorStore((state) => state.setSections);
    const updateSection = useResumeEditorStore((state) => state.updateSection);
    const addSection = useResumeEditorStore((state) => state.addSection);

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
                            school: "<b></b>",
                            location: "<b></b>",
                            degree: "<b></b>",
                            date: "<b></b>",
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
                            company: "<b></b>",
                            location: "<b></b>",
                            position: "<b></b>",
                            dates: "<b></b>",
                            description: [],
                        },
                    },
                ],
            },
        ]);
    }, [setSections]);
    return (
        <div
            className="bg-white text-black p-4"
            style={{
                width: "595pt",
            }}
        >
            {sections.map((s) => {
                return (
                    <section key={s.id}>
                        <EditableHeading
                            content={s.title}
                            setContent={(c) => updateSection(s.id, c)}
                        />
                        {s.items.map((i) => {
                            if (i.type === "education") {
                                return (
                                    <EducationItemWithId
                                        sectionId={s.id}
                                        itemId={i.id}
                                        key={i.id}
                                    />
                                );
                            }

                            if (i.type === "experience") {
                                return (
                                    <ExperienceItemWithId
                                        sectionId={s.id}
                                        itemId={i.id}
                                        key={i.id}
                                    />
                                );
                            }
                        })}
                    </section>
                );
            })}
            <button onClick={() => addSection("<b></b>")}>
                Add new section
            </button>
        </div>
    );
};

export default Editor;
