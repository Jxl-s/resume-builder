import { FC, useRef } from "react";
import EditableItem from "./EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { FaPlusCircle } from "react-icons/fa";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { useSection } from "../Section";
import DeleteDrag from "../DeleteDrag";
import {
    FaComputer,
    FaFile,
    FaGraduationCap,
    FaSuitcase,
} from "react-icons/fa6";
import fonts, { defaultFont } from "@/app/fonts";

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
    const addProjectNoLinks = useResumeEditorStore(
        (state) => state.addProjectNoLinks
    );

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

    // TODO: display goes in i18n
    const itemChoices = [
        {
            display: "Education",
            name: "education",
            action: addEducation,
            icon: FaGraduationCap,
        },
        {
            display: "Experience",
            name: "experience",
            action: addExperience,
            icon: FaSuitcase,
        },
        {
            display: "Project",
            name: "project",
            action: addProject,
            icon: FaComputer,
        },
        {
            display: "Project (no links)",
            name: "projectNoLinks",
            action: addProjectNoLinks,
            icon: FaComputer,
        },
        {
            display: "Custom Text",
            name: "customText",
            action: addText,
            icon: FaFile,
        },
    ] as const;

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
                className="w-3 h-3 inline text-primary/50 hover:text-primary duration-300 cursor-pointer print:hidden"
                onClick={onAddItem}
            />
            <div
                className={`absolute bg-dark2 p-2 rounded-lg z-10`}
                style={{
                    display: "none",
                    top: "calc(100% + 0.25rem)",
                    ...defaultFont.style,
                }}
                ref={addItemRef}
            >
                <p className="text-white font-semibold text-center border-b border-white mb-2">
                    Item Template
                </p>
                <ul className="text-primary text-sm font-semibold px-3 flex flex-col gap-y-1 gap-x-8">
                    {itemChoices.map((item) => (
                        <li
                            key={item.name}
                            className="hover:brightness-150 duration-300 cursor-pointer flex items-center gap-2"
                            onClick={() => {
                                if (!addItemRef.current) return;
                                addItemRef.current.style.display = "none";

                                item.action(sectionId);
                            }}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.display}
                        </li>
                    ))}
                </ul>
                <p
                    className="hover:brightness-150 duration-300 cursor-pointer font-semibold text-danger text-center text-sm mt-2"
                    onClick={onCancelAddItem}
                    style={defaultFont.style}
                >
                    Cancel
                </p>
            </div>
        </DeleteDrag>
    );
};

export default EditableHeading;
