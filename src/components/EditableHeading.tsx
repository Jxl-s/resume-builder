import { FC } from "react";
import EditableItem from "./EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";

interface Props {
    content: string;
    setContent: (content: string) => void;
}

const EditableHeading: FC<Props> = ({ content, setContent }) => {
    const headingSize = useDocSettingsStore((state) => state.headingSize);

    return (
        <EditableItem
            Component={"h1"}
            content={content}
            setContent={setContent}
            defaultStyle={["bold"]}
            placeholder="Heading"
            fontSize={headingSize}
            className="border-b-2 border-b-black outline-none mb-1"
        />
    );
};

export default EditableHeading;
