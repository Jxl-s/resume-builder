import { FC } from "react";
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
    const headingSize = useDocSettingsStore((state) => state.headingSize);
    const removeSection = useResumeEditorStore((state) => state.removeSection);
    const addExperience = useResumeEditorStore((state) => state.addExperience);

    const { sectionId } = useSection();

    const onRemoveSection = () => {
        removeSection(sectionId);
    };

    const onAddItem = () => {
        addExperience(sectionId); // temporary
    };

    return (
        <div className="border-b-2 border-b-black outline-none mb-1 flex items-center gap-2">
            <FaTrash
                className="w-3 h-3 -translate-x-5 absolute text-danger/50 hover:text-danger duration-300 cursor-pointer"
                onClick={onRemoveSection}
            />
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
        </div>
    );
};

export default EditableHeading;
