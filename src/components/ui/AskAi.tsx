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
            <Modal
                title="AI Bullet Enhancer"
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
                {aiGenerator.generating && (
                    <p className="print:hidden">Please wait while the AI is generating points...</p>
                )}
                {aiGenerator.generatedPoints.length > 0 && (
                    <div className="print:hidden">
                        <p>Select which points to keep</p>
                        <div className="text-sm flex flex-col gap-2 mt-2">
                            {aiGenerator.generatedPoints.map((c, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        name="kept-generated-points"
                                        checked={aiGenerator.keptPoints[i]}
                                        onChange={(e) => {
                                            setAiGenerator((prev) => {
                                                const copy = [...prev.keptPoints];
                                                copy[i] = e.target.checked;
                                                return {
                                                    ...prev,
                                                    keptPoints: copy,
                                                };
                                            });
                                        }}
                                    />
                                    {c}
                                </div>
                            ))}
                            <Button
                                className="py-2 w-full font-semibold flex gap-2 justify-center mt-2"
                                onClick={() => {
                                    // List of points to keep
                                    const keepPoints = aiGenerator.generatedPoints.filter(
                                        (_, i) => aiGenerator.keptPoints[i]
                                    );

                                    const sections = useResumeEditorStore.getState().sections;

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

                                    value.description.push(...keepPoints);

                                    // update the item's Description array at index chosenIndex
                                    updateItem(aiHelper.sectionId, aiHelper.itemId, copy);
                                    setAiHelper({
                                        sectionId: "",
                                        itemId: "",
                                        points: [],
                                        chosenIndex: -1,
                                        context: "",
                                    });
                                    setAiGenerator({
                                        generating: false,
                                        generatedPoints: [],
                                        keptPoints: [],
                                    });
                                }}
                            >
                                <FaHandSparkles className="w-4 h-4" />
                                Confirm Selection
                            </Button>
                        </div>
                    </div>
                )}
                {aiSearcher.searching && <p className="print:hidden">Please wait...</p>}
                {aiSearcher.searchResults.length > 0 && (
                    <div className="print:hidden">
                        Select which option to use to replace point.
                        <ul className="list-disc list-inside text-sm">
                            {aiSearcher.searchResults.map((c, i) => (
                                <li
                                    className="text-primary hover:brightness-125 duration-300 cursor-pointer my-1"
                                    onClick={() => {
                                        const sections = useResumeEditorStore.getState().sections;

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

                                        value.description = value.description.map((d, index) => {
                                            if (index === aiHelper.chosenIndex) return c;
                                            return d;
                                        });

                                        // update the item's Description array at index chosenIndex
                                        updateItem(aiHelper.sectionId, aiHelper.itemId, copy);

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
                {!aiGenerator.generating &&
                    aiGenerator.generatedPoints.length === 0 &&
                    !aiSearcher.searching &&
                    aiSearcher.searchResults.length === 0 && (
                        <div className="print:hidden">
                            <p className="text-center mb-1">Select a point to improve with AI</p>
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
                                                .filter((_, index) => index !== i)
                                                .map((p) => removeTags(p))
                                                .join("\n");

                                            let allPoints = "";
                                            document
                                                .querySelectorAll("ul[contenteditable=true]")
                                                .forEach((ul) => {
                                                    allPoints += ul.textContent + "\n";
                                                });

                                            // remove allPoints, remove the ones from otherPoints
                                            allPoints = allPoints
                                                .split("\n")
                                                .filter((p) => p !== "")
                                                .filter((p) => !otherPoints.includes(p))
                                                .join("\n");

                                            const res = await fetch("/api/ask_ai", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    type: "improve",
                                                    point: removeTags(c),
                                                    header: aiHelper.context,
                                                    job: useResumeEditorStore.getState()
                                                        .jobDescription,
                                                    otherPoints: otherPoints,
                                                    allPoints: allPoints,
                                                }),
                                            });

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
                            <hr className="my-2 opacity-50" />
                            <p className="text-sm text-center mb-1">Or, be creative</p>
                            <Button
                                theme="primary"
                                className="text-sm font-semibold px-4 w-full py-2 flex items-center gap-2 justify-center"
                                onClick={async () => {
                                    const otherPoints = aiHelper.points
                                        .map((p) => removeTags(p))
                                        .join("\n");

                                    let allPoints = "";
                                    document
                                        .querySelectorAll("ul[contenteditable=true]")
                                        .forEach((ul) => {
                                            allPoints += ul.textContent + "\n";
                                        });

                                    // remove allPoints, remove the ones from otherPoints
                                    allPoints = allPoints
                                        .split("\n")
                                        .filter((p) => p !== "")
                                        .filter((p) => !otherPoints.includes(p))
                                        .filter((p) => !p.startsWith("Enter bullet point #"))
                                        .join("\n");

                                    setAiGenerator({
                                        generating: true,
                                        generatedPoints: [],
                                        keptPoints: [],
                                    });

                                    const res = await fetch("/api/ask_ai", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            type: "generate",
                                            header: aiHelper.context,
                                            job: useResumeEditorStore.getState().jobDescription,
                                            otherPoints: otherPoints,
                                            allPoints: allPoints,
                                        }),
                                    });

                                    const resJson = await res.json();
                                    setAiGenerator({
                                        generating: false,
                                        generatedPoints: resJson,
                                        keptPoints: resJson.map(() => true),
                                    });
                                }}
                            >
                                <FaHandSparkles className="w-4 h-4" />
                                Generate New Points
                            </Button>
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
