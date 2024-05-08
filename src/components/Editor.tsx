"use client";

import { FC, useEffect, useState } from "react";
import EditableHeading from "./EditableHeading";
import EditableList from "./EditableList";
import EditableTwoSide from "./EditableTwoSide";
import Experience from "./section-items/Experience";
import useResumeEditorStore from "@/stores/useResumeEditorStore";

const Editor: FC = () => {
    // these are all temporary
    const sections = useResumeEditorStore((state) => state.sections);
    return (
        <div className="bg-white text-black p-4">
            {sections.map((section, index) => {
                return (
                    <div key={index} className="mb-4">
                        <EditableHeading content={section.title} setContent={(content) => {}} />
                        {section.items.map((item, index) => {
                            if (item.type === "experience") {
                                return (
                                    <Experience
                                        key={index}
                                        company={{ content: item.value.company, setContent: (content) => {} }}
                                        position={{ content: item.value.position, setContent: (content) => {} }}
                                        date={{ content: item.value.date, setContent: (content) => {} }}
                                        location={{ content: item.value.location, setContent: (content) => {} }}
                                        description={{ content: item.value.description, setContent: (content) => {} }}
                                    />
                                );
                            }
                        })}
                    </div>
                );
            })}
            {/* <EditableHeading content={name} setContent={setName} />
            {/* <EditableHeading content={title} setContent={setTitle} /> */}
            {/* <Experience
                company={{ content: topLeft, setContent: setTopLeft }}
                position={{ content: bottomLeft, setContent: setBottomLeft }}
                date={{ content: bottomRight, setContent: setBottomRight }}
                location={{ content: topRight, setContent: setTopRight }}
                description={{ content: items, setContent: setItems }}
            /> */}
        </div>
    );
};

export default Editor;
