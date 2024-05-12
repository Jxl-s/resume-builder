import { FC, use } from "react";
import EditableTwoSide from "../EditableTwoSide";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IExperienceItem } from "@/types/items";
import EditableList from "../EditableList";
import { useSection } from "../Section";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import DeleteDrag from "../DeleteDrag";

interface ExperienceItemProps {
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

const ExperienceItem: FC<ExperienceItemProps> = ({
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
    const moveItem = useResumeEditorStore((state) => state.moveItem);
    const onRemoveItem = () => {
        removeItem(sectionId, itemId);
    };

    return (
        <DeleteDrag
            className="mb-2 relative"
            style={{
                fontSize: contentSize + "pt",
            }}
            onDelete={onRemoveItem}
            onMoved={(dir) => moveItem(sectionId, itemId, dir)}
        >
            <EditableTwoSide
                left={{
                    content: position,
                    setContent: setPosition,
                    defaultStyle: ["bold"],
                    placeholder: "Position",
                }}
                right={{
                    content: dates,
                    setContent: setDates,
                    defaultStyle: ["bold"],
                    placeholder: "Dates",
                }}
            />
            <EditableTwoSide
                left={{
                    content: company,
                    setContent: setCompany,
                    defaultStyle: ["italic"],
                    placeholder: "Company",
                }}
                right={{
                    content: location,
                    setContent: setLocation,
                    defaultStyle: ["italic"],
                    placeholder: "Location",
                }}
            />
            <EditableList items={description} setItems={setDescription} />
        </DeleteDrag>
    );
};

interface ExperienceItemWithIdProps {
    itemId: string;
}

const ExperienceItemWithId: FC<ExperienceItemWithIdProps> = ({ itemId }) => {
    const { sectionId } = useSection();
    const experienceItem = useResumeEditorStore((state) =>
        state.sections
            .find((section) => section.id === sectionId)
            ?.items.find((item) => item.id === itemId)
    );

    const updateItem = useResumeEditorStore((state) => state.updateItem);
    if (!experienceItem) return null;

    const { company, location, position, dates, description } =
        experienceItem.value as IExperienceItem;

    const setCompany = (company: string) => {
        updateItem(sectionId, itemId, {
            ...experienceItem,
            value: { ...experienceItem.value, company },
        });
    };

    const setLocation = (location: string) => {
        updateItem(sectionId, itemId, {
            ...experienceItem,
            value: { ...experienceItem.value, location },
        });
    };

    const setPosition = (position: string) => {
        updateItem(sectionId, itemId, {
            ...experienceItem,
            value: { ...experienceItem.value, position },
        });
    };

    const setDates = (dates: string) => {
        updateItem(sectionId, itemId, {
            ...experienceItem,
            value: { ...experienceItem.value, dates },
        });
    };

    const setDescription = (description: string[]) => {
        updateItem(sectionId, itemId, {
            ...experienceItem,
            value: { ...experienceItem.value, description },
        });
    };
    return (
        <ExperienceItem
            itemId={itemId}
            company={company}
            setCompany={setCompany}
            location={location}
            setLocation={setLocation}
            position={position}
            setPosition={setPosition}
            dates={dates}
            setDates={setDates}
            description={description}
            setDescription={setDescription}
        />
    );
};

export default ExperienceItem;
export { ExperienceItemWithId };
