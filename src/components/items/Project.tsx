import { FC, use } from "react";
import EditableTwoSide from "../EditableTwoSide";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IProjectItem } from "@/types/items";
import EditableList from "../EditableList";
import { useSection } from "../Section";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import DeleteDrag from "../DeleteDrag";
import EditableThreeSide from "../EditableThreeSide";

interface ProjectItemProps {
    itemId: string;

    name: string;
    setName: (name: string) => void;

    technologies: string;
    setTechnologies: (technologies: string) => void;

    source?: string;
    setSource: (source: string) => void;

    demo?: string;
    setDemo: (demo: string) => void;

    dates: string;
    setDates: (dates: string) => void;

    description: string[];
    setDescription: (description: string[]) => void;
}

const ProjectItem: FC<ProjectItemProps> = ({
    itemId,
    name,
    setName,
    technologies,
    setTechnologies,
    source,
    setSource,
    demo,
    setDemo,
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
            <EditableThreeSide
                left={{
                    content: name,
                    setContent: setName,
                    defaultStyle: ["bold"],
                    placeholder: "Name",
                }}
                afterLeft={{
                    content: technologies,
                    setContent: setTechnologies,
                    defaultStyle: ["italic"],
                    placeholder: "Tech Stack #1, Tech Stack #2, ...",
                }}
                right={{
                    content: dates,
                    setContent: setDates,
                    defaultStyle: ["bold"],
                    placeholder: "Date - Date",
                }}
            />
            {/* <EditableTwoSide
                left={{
                    content: source ?? "No Source",
                    setContent: setSource,
                    defaultStyle: ["italic", "underline"],
                    placeholder: "Source Link",
                }}
                right={{
                    content: demo ?? "No Demo",
                    setContent: setDates,
                    defaultStyle: ["italic", "underline"],
                    placeholder: "Demo Link",
                }}
            /> */}
            <EditableList items={description} setItems={setDescription} />
        </DeleteDrag>
    );
};

interface ExperienceItemWithIdProps {
    itemId: string;
}

const ProjectItemWithId: FC<ExperienceItemWithIdProps> = ({ itemId }) => {
    const { sectionId } = useSection();
    const projectItem = useResumeEditorStore((state) =>
        state.sections
            .find((section) => section.id === sectionId)
            ?.items.find((item) => item.id === itemId)
    );

    const updateItem = useResumeEditorStore((state) => state.updateItem);
    if (!projectItem) return null;

    const { dates, description, name, technologies, source, demo } =
        projectItem.value as IProjectItem;

    const setName = (name: string) => {
        updateItem(sectionId, itemId, {
            ...projectItem,
            value: { ...projectItem.value, name },
        });
    };

    const setTechnologies = (technologies: string) => {
        updateItem(sectionId, itemId, {
            ...projectItem,
            value: { ...projectItem.value, technologies },
        });
    };

    const setSource = (source: string) => {
        updateItem(sectionId, itemId, {
            ...projectItem,
            value: { ...projectItem.value, source },
        });
    };

    const setDemo = (demo: string) => {
        updateItem(sectionId, itemId, {
            ...projectItem,
            value: { ...projectItem.value, demo },
        });
    };

    const setDates = (dates: string) => {
        updateItem(sectionId, itemId, {
            ...projectItem,
            value: { ...projectItem.value, dates },
        });
    };

    const setDescription = (description: string[]) => {
        updateItem(sectionId, itemId, {
            ...projectItem,
            value: { ...projectItem.value, description },
        });
    };

    return (
        <ProjectItem
            itemId={itemId}
            name={name}
            setName={setName}
            technologies={technologies}
            setTechnologies={setTechnologies}
            source={source}
            setSource={setSource}
            demo={demo}
            setDemo={setDemo}
            dates={dates}
            setDates={setDates}
            description={description}
            setDescription={setDescription}
        />
    );
};

export default ProjectItem;
export { ProjectItemWithId };