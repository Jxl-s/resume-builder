import { FC, useRef } from "react";
import EditableItem from "./EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { FaGripVertical, FaPlusCircle, FaTrash } from "react-icons/fa";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { useSection } from "./Section";
import DeleteDrag from "./DeleteDrag";
import Button from "./Button";

interface Props {
    content: string;
    setContent: (content: string) => void;
}

const EditableHeading: FC<Props> = ({ content, setContent }) => {
    const addItemRef = useRef<HTMLDivElement>(null);
    const headingSize = useDocSettingsStore((state) => state.headingSize);
    const removeSection = useResumeEditorStore((state) => state.removeSection);
    const addExperience = useResumeEditorStore((state) => state.addExperience);
    const addEducation = useResumeEditorStore((state) => state.addEducation);
    const addText = useResumeEditorStore((state) => state.addText);
    const addProject = useResumeEditorStore((state) => state.addProject);

    const moveSection = useResumeEditorStore((state) => state.moveSection);

    const { sectionId } = useSection();

    const onRemoveSection = () => {
        removeSection(sectionId);
    };

    const onAddItem = () => {
        if (!addItemRef.current) return;
        addItemRef.current.style.display = "flex";
    };

    const onConfirmAddItem = (type: string) => {
        if (!addItemRef.current) return;
        addItemRef.current.style.display = "none";

        switch (type) {
            case "Experience":
                addExperience(sectionId);
                break;
            case "Education":
                addEducation(sectionId);
                break;
            case "Project":
                addProject(sectionId);
                break;
            case "Custom Text":
                addText(sectionId);
                break;
            default:
                break;
        }
    };

    const onCancelAddItem = () => {
        if (!addItemRef.current) return;
        addItemRef.current.style.display = "none";
    };

    return (
        <DeleteDrag
            onDelete={onRemoveSection}
            onMoved={(dir) => moveSection(sectionId, dir)}
            className="border-b border-b-black outline-none mb-1 flex items-center gap-2"
        >
            <EditableItem
                Component={"h1"}
                content={content}
                setContent={setContent}
                defaultStyle={[]}
                placeholder="Heading"
                fontSize={headingSize}
                className="inline uppercase"
            />
            <FaPlusCircle
                className="print:hidden w-3 h-3 inline text-primary/50 hover:text-primary duration-300 cursor-pointer"
                onClick={onAddItem}
            />
            <div
                className={`absolute bg-dark2 p-2 rounded-lg top-full gap-2 z-10`}
                style={{
                    display: "none",
                }}
                ref={addItemRef}
            >
                <Button
                    theme="primary"
                    className="text-sm font-semibold px-2 py-1"
                    onClick={() => onConfirmAddItem("Education")}
                >
                    Education
                </Button>
                <Button
                    theme="primary"
                    className="text-sm font-semibold px-2 py-1"
                    onClick={() => onConfirmAddItem("Experience")}
                >
                    Experience
                </Button>
                <Button
                    theme="primary"
                    className="text-sm font-semibold px-2 py-1"
                    onClick={() => onConfirmAddItem("Project")}
                >
                    Project
                </Button>
                <Button
                    theme="primary"
                    className="text-sm font-semibold px-2 py-1"
                    onClick={() => onConfirmAddItem("Custom Text")}
                >
                    Custom Text
                </Button>
                <Button
                    theme="danger"
                    className="text-sm font-semibold px-2 py-1"
                    onClick={onCancelAddItem}
                >
                    Cancel
                </Button>
            </div>
        </DeleteDrag>
    );
};

export default EditableHeading;
