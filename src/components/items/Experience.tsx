import { FC, use } from "react";
import EditableTwoSide from "../EditableTwoSide";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IExperienceItem } from "@/types/items";
import EditableList from "../EditableList";

interface ExperienceItemProps {
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
    const contentSize = useDocSettingsStore((state) => state.contentSize);

    return (
        <article
            className="mb-2"
            style={{
                fontSize: contentSize + "pt",
            }}
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
        </article>
    );
};

interface ExperienceItemWithIdProps {
    sectionId: string;
    itemId: string;
}

const ExperienceItemWithId: FC<ExperienceItemWithIdProps> = ({
    sectionId,
    itemId,
}) => {
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
