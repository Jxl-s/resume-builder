import { FC, use } from "react";
import EditableTwoSide from "../EditableTwoSide";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IEducationItem } from "@/types/items";
import { useSection } from "../Section";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import DeleteDrag from "../DeleteDrag";

interface EducationItemProps {
    itemId: string;

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
    itemId,
    school,
    setSchool,
    location,
    setLocation,
    degree,
    setDegree,
    date,
    setDate,
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
            className="my-auto mb-2"
            onMoved={(dir) => moveItem(sectionId, itemId, dir)}
            style={{
                fontSize: contentSize + "pt",
            }}
            onDelete={onRemoveItem}
        >
            <EditableTwoSide
                left={{
                    content: school,
                    setContent: setSchool,
                    defaultStyle: ["bold"],
                    placeholder: "Harvard University",
                }}
                right={{
                    content: date,
                    setContent: setDate,
                    defaultStyle: ["bold"],
                    placeholder: "Jan 2020",
                }}
            />
            <EditableTwoSide
                left={{
                    content: degree,
                    setContent: setDegree,
                    defaultStyle: ["italic"],
                    placeholder: "Bachelor's Degree in Y",
                }}
                right={{
                    content: location,
                    setContent: setLocation,
                    defaultStyle: ["italic"],
                    placeholder: "Toronto, ON",
                }}
            />
        </DeleteDrag>
    );
};

interface EducationItemWithIdProps {
    itemId: string;
}

const EducationItemWithId: FC<EducationItemWithIdProps> = ({ itemId }) => {
    const { sectionId } = useSection();
    const educationItem = useResumeEditorStore((state) =>
        state.sections
            .find((section) => section.id === sectionId)
            ?.items.find((item) => item.id === itemId)
    );

    const updateItem = useResumeEditorStore((state) => state.updateItem);
    if (!educationItem) return null;

    const { school, location, degree, date } =
        educationItem.value as IEducationItem;

    const setSchool = (school: string) =>
        updateItem(sectionId, itemId, {
            ...educationItem,
            value: { ...educationItem.value, school },
        });

    const setLocation = (location: string) =>
        updateItem(sectionId, itemId, {
            ...educationItem,
            value: { ...educationItem.value, location },
        });

    const setDegree = (degree: string) =>
        updateItem(sectionId, itemId, {
            ...educationItem,
            value: { ...educationItem.value, degree },
        });

    const setDate = (date: string) =>
        updateItem(sectionId, itemId, {
            ...educationItem,
            value: { ...educationItem.value, date },
        });

    return (
        <EducationItem
            itemId={itemId}
            school={school}
            setSchool={setSchool}
            location={location}
            setLocation={setLocation}
            degree={degree}
            setDegree={setDegree}
            date={date}
            setDate={setDate}
        />
    );
};

export default EducationItem;
export { EducationItemWithId };
