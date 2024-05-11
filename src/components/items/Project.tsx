import { FC, use } from "react";
import EditableTwoSide from "../EditableTwoSide";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IProjectItem } from "@/types/items";
import EditableList from "../EditableList";
import { useSection } from "../Section";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import DeleteDrag from "../DeleteDrag";

interface ProjectItemProps {
    itemId: string;

    company: string;
    setCompany: (company: string) => void;

    location: string;
    setLocation: (location: string) => void;

    position: string;
    setPosition: (position: string) => void;

    dates: string;
    setDates: (dates: string) => void;

    description: string[];
    setDescription: (description: string[]) => void;
}

const ProjectItem: FC<ProjectItemProps> = ({
    itemId,

    company,
    setCompany,
    location,
    setLocation,
    position,
    setPosition,
    dates,
    setDates,
    description,
    setDescription,
}) => {
    const { sectionId } = useSection();
    const contentSize = useDocSettingsStore((state) => state.contentSize);
    const removeItem = useResumeEditorStore((state) => state.removeItem);

    const onRemoveItem = () => {
        removeItem(sectionId, itemId);
    };

    return (
        <DeleteDrag
            idString={sectionId + "_" + itemId}
            className="mb-2 relative"
            style={{
                fontSize: contentSize + "pt",
            }}
            onDelete={onRemoveItem}
            onMoved={() => {}}
        >
            <EditableTwoSide
                left={{
                    content: company,
                    setContent: setCompany,
                    defaultStyle: ["bold"],
                    placeholder: "Company",
                }}
                right={{
                    content: location,
                    setContent: setLocation,
                    defaultStyle: ["bold"],
                    placeholder: "Location",
                }}
            />
            <EditableTwoSide
                left={{
                    content: position,
                    setContent: setPosition,
                    defaultStyle: ["italic"],
                    placeholder: "Position",
                }}
                right={{
                    content: dates,
                    setContent: setDates,
                    defaultStyle: ["italic"],
                    placeholder: "Dates",
                }}
            />
            <EditableList items={description} setItems={setDescription} />
        </DeleteDrag>
    );
};

export default ProjectItem;
