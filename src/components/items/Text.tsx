import { FC } from "react";
import EditableItem from "../EditableItem";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { useSection } from "../Section";
import { ITextItem } from "@/types/items";
import { FaGripVertical, FaTrash } from "react-icons/fa";
import DeleteDrag from "../DeleteDrag";

interface Props {
    itemId: string;
    content: string;
    setContent: (content: string) => void;
}

const TextItem: FC<Props> = ({ itemId, content, setContent }) => {
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
            <EditableItem
                content={content}
                setContent={setContent}
                className="w-full inline-block"
                Component={"div"}
                allowMultiLine={true}
                placeholder="Text here"
            />
        </DeleteDrag>
    );
};

interface TextItemWithIdProps {
    itemId: string;
}

const TextItemWithId: FC<TextItemWithIdProps> = ({ itemId }) => {
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

    return <TextItem itemId={itemId} content={text} setContent={setText} />;
};

export default TextItem;
export { TextItemWithId };
