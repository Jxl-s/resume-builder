import { FC, useRef } from "react";
import EditableItem from "./EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { FaGripVertical, FaPlusCircle, FaTrash } from "react-icons/fa";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { useSection } from "./Section";
import DeleteDrag from "./DeleteDrag";
import Button from "./Button";
import {
    FaComputer,
    FaFile,
    FaGraduationCap,
    FaSuitcase,
} from "react-icons/fa6";

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
        if (addItemRef.current.style.display === "block") {
            addItemRef.current.style.display = "none";
            return;
        } else {
            addItemRef.current.style.display = "block";
        }
    };

    const onConfirmAddItem = (
        type: "Experience" | "Education" | "Project" | "Custom Text"
    ) => {
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
                className={`absolute bg-dark2 p-2 rounded-lg z-10`}
                style={{
                    display: "none",
                    top: 'calc(100% + 0.25rem)',
                }}
                ref={addItemRef}
            >
                <p className="text-white font-semibold text-center border-b border-white mb-2">
                    Add a New Item
                </p>
                <ul className="text-primary text-sm font-semibold px-3 flex flex-col gap-y-1 gap-x-8">
                    <li
                        className="hover:brightness-150 duration-300 cursor-pointer flex items-center gap-2"
                        onClick={() => onConfirmAddItem("Education")}
                    >
                        <FaGraduationCap className="w-4 h-4" /> Education
                    </li>
                    <li
                        className="hover:brightness-150 duration-300 cursor-pointer flex items-center gap-2"
                        onClick={() => onConfirmAddItem("Experience")}
                    >
                        <FaSuitcase className="w-4 h-4" /> Experience
                    </li>
                    <li
                        className="hover:brightness-150 duration-300 cursor-pointer flex items-center gap-2"
                        onClick={() => onConfirmAddItem("Project")}
                    >
                        <FaComputer className="w-4 h-4" />
                        Project
                    </li>
                    <li
                        className="hover:brightness-150 duration-300 cursor-pointer flex items-center gap-2"
                        onClick={() => onConfirmAddItem("Custom Text")}
                    >
                        <FaFile className="w-4 h-4" />
                        Custom Text
                    </li>
                </ul>
                <p
                    className="hover:brightness-150 duration-300 cursor-pointer font-semibold text-danger text-center text-sm mt-2"
                    onClick={() => onCancelAddItem()}
                >
                    Cancel
                </p>
                {/* <Button
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
                </Button> */}
            </div>
        </DeleteDrag>
    );
};

export default EditableHeading;
