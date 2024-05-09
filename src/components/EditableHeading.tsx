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

    const { sectionId } = useSection();

    const onRemoveSection = () => {
        removeSection(sectionId);
    };

    const onAddItem = () => {
        addEducation(sectionId); // temporary
    };

    return (
        <DeleteDrag
            onDelete={onRemoveSection}
            onMoved={() => {}}
            className="border-b border-b-black outline-none mb-1 gap-2"
        >
            <EditableItem
                Component={"h1"}
                content={content}
                setContent={setContent}
                defaultStyle={[]}
                placeholder="Heading"
                fontSize={headingSize}
                className="inline"
            />
            <FaPlusCircle
                className="w-4 h-4 inline text-primary/50 hover:text-primary duration-300 cursor-pointer"
                onClick={onAddItem}
            />
        </DeleteDrag>
    );
};

export default EditableHeading;
