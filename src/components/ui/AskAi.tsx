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

        if (item.type === "project") {
            const project = item.value as IProjectItem;

            const context = [
                "Project",
                project.name,
                project.dates,
                project.technologies,
                project.source,
                project.demo,
            ].join(",");

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
            <Modal
                title="AI Helper"
                visible={aiHelper.itemId !== "" && aiHelper.sectionId !== ""}
                onClose={() => {
                    setAiHelper({
                        sectionId: "",
                        itemId: "",
                        points: [],
                        chosenIndex: -1,
                        context: "",
                    });
                    setAiSearcher({ searching: false, searchResults: [] });
                }}
            >
                {aiSearcher.searching && (
                    <p className="print:hidden">Please wait...</p>
                )}
                {aiSearcher.searchResults.length > 0 && (
                    <div className="print:hidden">
                        Select which option to use to replace point.
                        <ul className="list-disc list-inside text-sm">
                            {aiSearcher.searchResults.map((c, i) => (
                                <li
                                    className="text-primary hover:brightness-125 duration-300 cursor-pointer my-1"
                                    onClick={() => {
                                        const sections =
                                            useResumeEditorStore.getState()
                                                .sections;

                                        // find the section and item
                                        const section = sections.find(
                                            (s) => s.id === aiHelper.sectionId
                                        );
                                        if (!section) return;

                                        const item = section.items.find(
                                            (i) => i.id === aiHelper.itemId
                                        );

                                        if (!item) return;
                                        const copy = { ...item };
                                        const value = copy.value as {
                                            description: string[];
                                        };

                                        value.description =
                                            value.description.map(
                                                (d, index) => {
                                                    if (
                                                        index ===
                                                        aiHelper.chosenIndex
                                                    )
                                                        return c;
                                                    return d;
                                                }
                                            );

                                        // update the item's Description array at index chosenIndex
                                        updateItem(
                                            aiHelper.sectionId,
                                            aiHelper.itemId,
                                            copy
                                        );

                                        setAiHelper({
                                            sectionId: "",
                                            itemId: "",
                                            points: [],
                                            chosenIndex: -1,
                                            context: "",
                                        });
                                        setAiSearcher({
                                            searching: false,
                                            searchResults: [],
                                        });
                                    }}
                                    key={i}
                                >
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {!aiSearcher.searching &&
                    aiSearcher.searchResults.length === 0 && (
                        <div className="print:hidden">
                            Select which bullet point to fix with AI
                            <ul className="list-disc list-inside text-sm">
                                {aiHelper.points.map((c, i) => (
                                    <li
                                        className="text-primary hover:brightness-125 duration-300 cursor-pointer my-1"
                                        onClick={async () => {
                                            setAiHelper({
                                                ...aiHelper,
                                                chosenIndex: i,
                                            });

                                            setAiSearcher({
                                                searching: true,
                                                searchResults: [],
                                            });

                                            const otherPoints = aiHelper.points
                                                .filter(
                                                    (_, index) => index !== i
                                                )
                                                .map((p) => removeTags(p))
                                                .join("\n");

                                            const res = await fetch(
                                                "/api/ask_ai",
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        point: removeTags(c),
                                                        header: aiHelper.context,
                                                        job: "",
                                                        otherPoints:
                                                            otherPoints,
                                                    }),
                                                }
                                            );

                                            const resJson = await res.json();
                                            setAiSearcher({
                                                searching: false,
                                                searchResults: resJson,
                                            });
                                        }}
                                        key={i}
                                    >
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
            </Modal>

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
