import { FC, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import useFocusedListStore from "@/stores/useFocusedListStore";
import { IExperienceItem, IProjectItem } from "@/types/items";
import { removeTags } from "@/utils/sanitizeHtml";
import { FaHandSparkles } from "react-icons/fa";
import EnhancerModal from "../modals/EnhancerModal";

const AskAi: FC = () => {
    const updateItem = useResumeEditorStore((state) => state.updateItem);

    const [focusedSectionId, focusedItemId] = useFocusedListStore((state) => [
        state.focusedSectionId,
        state.focusedItemId,
    ]);

    const [aiHelper, setAiHelper] = useState({
        sectionId: "",
        itemId: "",
        context: "",
        points: [] as string[],
        chosenIndex: -1,
    });

    const [aiSearcher, setAiSearcher] = useState({
        searching: false,
        searchResults: [] as string[],
    });

    const [aiGenerator, setAiGenerator] = useState({
        generating: false,
        generatedPoints: [] as string[],
        keptPoints: [] as boolean[],
    });

    const [[currentSectionId, currentItemId], setCurrentItem] = useState(["", ""]);
    const [modalOpened, setModalOpened] = useState(false);

    const onAskAi = (sectionId: string, itemId: string) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        setCurrentItem([sectionId, itemId]);
        setModalOpened(true);
    };

    return (
        <>
            <EnhancerModal
                itemId={currentItemId}
                sectionId={currentSectionId}
                onClose={() => setModalOpened(false)}
                visible={modalOpened}
            />
            <Button
                theme="primaryOutline"
                className="text-sm font-semibold px-4 flex gap-2 items-center"
                disabled={focusedItemId === "" && focusedSectionId === ""}
                onClick={() => onAskAi(focusedSectionId, focusedItemId)}
                onMouseDown={(e) => e.preventDefault()}
                title="Select a bullet list and click here to get AI suggestions"
            >
                <FaHandSparkles className="w-4 h-4" />
                Ask AI
            </Button>
        </>
    );
};

export default AskAi;
