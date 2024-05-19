import { FC, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import useFocusedListStore from "@/stores/useFocusedListStore";
import { IExperienceItem, IProjectItem } from "@/types/items";
import { removeTags } from "@/utils/sanitizeHtml";
import { FaHandSparkles } from "react-icons/fa";

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

    const onAskAi = (sectionId: string, itemId: string) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        const sections = useResumeEditorStore.getState().sections;
        // find the section and item
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return;

        const item = section.items.find((i) => i.id === itemId);
        if (!item) return;

        // get the type (experience or project)
        if (item.type === "experience") {
            const experience = item.value as IExperienceItem;

            const context = [
                "Experience",
                removeTags(experience.position),
                removeTags(experience.company),
                removeTags(experience.dates),
                removeTags(experience.location),
            ].join(",");

            setAiHelper({
                sectionId: sectionId,
                itemId: itemId,
                points: experience.description,
                context,
                chosenIndex: -1,
            });
        }

        if (item.type === "project" || item.type === "project-nolinks") {
            const project = item.value as IProjectItem;

            const context = [
                "Project",
                project.name,
                project.dates,
                project.technologies,
                project.source ?? "",
                project.demo ?? "",
            ]
                .filter((a) => a !== "")
                .join(",");

            setAiHelper({
                sectionId: sectionId,
                itemId: itemId,
                points: project.description,
                context,
                chosenIndex: -1,
            });
        }
    };

    return (
        <>
            

            <Button
                theme="primaryOutline"
                className="text-sm font-semibold px-4 flex gap-2 items-center"
                disabled={focusedItemId === "" && focusedSectionId === ""}
                onClick={() => {
                    onAskAi(focusedSectionId, focusedItemId);
                }}
                onMouseDown={(e) => e.preventDefault()}
            >
                <FaHandSparkles className="w-4 h-4" />
                Ask AI
            </Button>
        </>
    );
};

export default AskAi;
