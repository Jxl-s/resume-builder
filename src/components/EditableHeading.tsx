import { FC } from "react";
import EditableItem from "./EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { FaGripVertical, FaPlusCircle, FaTrash } from "react-icons/fa";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { useSection } from "./Section";
import DeleteDrag from "./DeleteDrag";

interface Props {
    content: string;
    setContent: (content: string) => void;
}

const EditableHeading: FC<Props> = ({ content, setContent }) => {
    const headingSize = useDocSettingsStore((state) => state.headingSize);
    const removeSection = useResumeEditorStore((state) => state.removeSection);
    const addExperience = useResumeEditorStore((state) => state.addExperience);
    const addEducation = useResumeEditorStore((state) => state.addEducation);
    const addText = useResumeEditorStore((state) => state.addText);
    const addProject = useResumeEditorStore((state) => state.addProject);

    const { sectionId } = useSection();

    const onRemoveSection = () => {
        removeSection(sectionId);
    };

    const onAddItem = () => {
        addProject(sectionId); // temporary
        addExperience(sectionId);
        addEducation(sectionId);
        addText(sectionId);
    };

    return (
        <DeleteDrag
            idString={"_" + sectionId}
            onDelete={onRemoveSection}
            onMoved={() => {}}
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
                className="w-3 h-3 inline text-primary/50 hover:text-primary duration-300 cursor-pointer"
                onClick={onAddItem}
            />
        </DeleteDrag>
    );
};

export default EditableHeading;
