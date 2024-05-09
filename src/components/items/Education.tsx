import { FC, use } from "react";
import EditableTwoSide from "../EditableTwoSide";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IEducationItem } from "@/types/items";
import { useSection } from "../Section";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import DeleteDrag from "../DeleteDrag";
import { DraggedOverType } from "@/stores/useResumeDraggerStore";

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

    const onRemoveItem = () => {
        removeItem(sectionId, itemId);
    };

    return (
        <DeleteDrag
            dragType={DraggedOverType.Item}
            idString={sectionId + "-" + itemId}
            className="relative my-auto"
            style={{
                fontSize: contentSize + "pt",
            }}
            onDelete={onRemoveItem}
            onMoved={() => {}}
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
