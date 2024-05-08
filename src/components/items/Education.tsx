import { FC, use } from "react";
import EditableTwoSide from "../EditableTwoSide";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IEducationItem } from "@/types/items";

interface EducationItemProps {
    school: string;
    setSchool: (school: string) => void;

    location: string;
    setLocation: (location: string) => void;

    degree: string;
    setDegree: (degree: string) => void;

    date: string;
    setDate: (date: string) => void;
}

const EducationItem: FC<EducationItemProps> = ({
    school,
    setSchool,
    location,
    setLocation,
    degree,
    setDegree,
    date,
    setDate,
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
                    content: school,
                    setContent: setSchool,
                    defaultStyle: ["bold"],
                    placeholder: "School",
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
                    content: degree,
                    setContent: setDegree,
                    defaultStyle: ["italic"],
                    placeholder: "Degree",
                }}
                right={{
                    content: date,
                    setContent: setDate,
                    defaultStyle: ["italic"],
                    placeholder: "Date",
                }}
            />
        </article>
    );
};

interface EducationItemWithIdProps {
    sectionId: string;
    itemId: string;
}

const EducationItemWithId: FC<EducationItemWithIdProps> = ({
    sectionId,
    itemId,
}) => {
    const educationItem = useResumeEditorStore((state) =>
        state.sections
            .find((section) => section.id === sectionId)
            ?.items.find((item) => item.id === itemId)
    );

    if (!educationItem) return null;

    const { school, location, degree, date } =
        educationItem.value as IEducationItem;

    return (
        <EducationItem
            school={school}
            setSchool={() => {}}
            location={location}
            setLocation={() => {}}
            degree={degree}
            setDegree={() => {}}
            date={date}
            setDate={() => {}}
        />
    );
};

export default EducationItem;
export { EducationItemWithId };
