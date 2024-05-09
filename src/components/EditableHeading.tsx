import { FC, useEffect, useRef, useState } from "react";
import EditableItem from "./EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { useSection } from "./Section";

interface Props {
    content: string;
    setContent: (content: string) => void;
}

const EditableHeading: FC<Props> = ({ content, setContent }) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const headingSize = useDocSettingsStore((state) => state.headingSize);
    const removeSection = useResumeEditorStore((state) => state.removeSection);
    const addItem = useResumeEditorStore((state) => state.addItem);

    const { sectionId } = useSection();

    // Have to do this due to react and contentEditable's behaviours
    const handlePointerEnter = () => {
        if (!tooltipRef.current) return;
        tooltipRef.current.style.display = "flex";
    };

    const handlePointerLeave = () => {
        if (!tooltipRef.current) return;
        tooltipRef.current.style.display = "none";
    };

    const onRemoveSection = () => {
        removeSection(sectionId);
    };

    const onAddItem = () => {
        addItem(sectionId, {
            type: "education",
            id: Math.random().toString(36).substr(2, 9),
            value: {
                school: "<b></b>",
                location: "<b></b>",
                degree: "<i></i>",
                date: "<i></i>",
            },
        });
    };

    return (
        <div
            className="border-b-2 border-b-black outline-none mb-1 flex items-center gap-2"
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <EditableItem
                Component={"h1"}
                content={content}
                setContent={setContent}
                defaultStyle={["bold"]}
                placeholder="Heading"
                fontSize={headingSize}
                className="inline"
            />
            <div
                className={`gap-2`}
                ref={tooltipRef}
                style={{
                    display: "none",
                }}
            >
                <FaPlusCircle
                    className="w-4 h-4 inline text-primary/50 hover:text-primary duration-300 cursor-pointer"
                    onClick={onAddItem}
                />
                <FaTrash
                    className="w-3 h-3 inline text-danger/50 hover:text-danger duration-300 cursor-pointer"
                    onClick={onRemoveSection}
                />
            </div>
        </div>
    );
};

export default EditableHeading;
