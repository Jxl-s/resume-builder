import { FC, useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import useFocusedListStore from "@/stores/useFocusedListStore";
import { IExperienceItem, IProjectItem } from "@/types/items";
import { removeTags } from "@/utils/sanitizeHtml";
import { FaHandSparkles } from "react-icons/fa";
import EnhancerModal from "../modals/EnhancerModal";
import { useTranslations } from "next-intl";

const AskAi: FC = () => {
    const t = useTranslations("ToolBar");

    const [focusedSectionId, focusedItemId] = useFocusedListStore((state) => [
        state.focusedSectionId,
        state.focusedItemId,
    ]);

    const [aiOnline, setAiOnline] = useState<boolean | null>(null);

    const [[currentSectionId, currentItemId], setCurrentItem] = useState([
        "",
        "",
    ]);
    const [modalOpened, setModalOpened] = useState(false);

    const onAskAi = (sectionId: string, itemId: string) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        setCurrentItem([sectionId, itemId]);
        setModalOpened(true);
    };

    useEffect(() => {
        // Check if the API is online
        async function checkApi() {
            const res = await fetch("/api/status/ai");
            if (res.status === 200) {
                setAiOnline(true);
            } else {
                setAiOnline(false);
            }
        }

        checkApi();
    }, []);

    return (
        <>
            <EnhancerModal
                itemId={currentItemId}
                sectionId={currentSectionId}
                onClose={() => {
                    setCurrentItem(["", ""]);
                    setModalOpened(false);
                }}
                visible={modalOpened}
            />
            <Button
                theme="primaryOutline"
                className="text-sm font-semibold px-4 flex gap-2 items-center"
                disabled={
                    !aiOnline ||
                    (focusedItemId === "" && focusedSectionId === "")
                }
                onClick={() => onAskAi(focusedSectionId, focusedItemId)}
                onMouseDown={(e) => e.preventDefault()}
                title="Select a bullet list and click here to get AI suggestions"
            >
                <FaHandSparkles className="w-4 h-4" />
                {aiOnline === null
                    ? t("checking")
                    : aiOnline
                    ? t("ai_ask")
                    : t("ai_offline")}
            </Button>
        </>
    );
};

export default AskAi;
