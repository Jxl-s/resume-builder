import { FC } from "react";
import EditableItem from "../EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { useSection } from "../Section";
import { ITextItem } from "@/types/items";

interface Props {
    content: string;
    setContent: (content: string) => void;
}

const TextItem: FC<Props> = ({ content, setContent }) => {
    const contentSize = useDocSettingsStore((state) => state.contentSize);
    return (
        <EditableItem
            content={content}
            setContent={setContent}
            className="w-full inline-block mb-2"
            Component={"div"}
            allowMultiLine={true}
            fontSize={contentSize}
            placeholder="Text here"
        />
    );
};

const TextItemWithId: FC<{ itemId: string }> = ({ itemId }) => {
    const { sectionId } = useSection();
    const textItem = useResumeEditorStore((state) =>
        state.sections
            .find((section) => section.id === sectionId)
            ?.items.find((item) => item.id === itemId)
    );

    const updateItem = useResumeEditorStore((state) => state.updateItem);
    if (!textItem) return null;

    const { text } = textItem.value as ITextItem;

    const setText = (text: string) => {
        updateItem(sectionId, itemId, {
            ...textItem,
            value: { ...textItem.value, text },
        });
    };

    return <TextItem content={text} setContent={setText} />;
};

export default TextItem;
export { TextItemWithId };
