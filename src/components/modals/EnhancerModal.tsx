import { FC, useMemo, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { FaHandSparkles } from "react-icons/fa";
import useResumeEditorStore from "../../stores/useResumeEditorStore";
import { IExperienceItem, IProjectItem, ITextItem } from "../../types/items";
import { removeTags } from "../../utils/sanitizeHtml";

enum EnhancerScreen {
    Select,
    WaitEnhance,
    WaitGenerate,
    ResultGenerate,
    ResultEnhance,
}

interface Props {
    visible: boolean;
    sectionId: string;
    itemId: string;
    screen: EnhancerScreen;
    onClose: () => void;
}

const EnhancerModal: FC = ({ visible, sectionId, itemId, screen, onClose }: Props) => {
    const updateItem = useResumeEditorStore((state) => state.updateItem);

    // Handle selection
    const [enhanceIndex, setEnhanceIndex] = useState(-1);

    // Handle results
    const [enhancer, setEnhancer] = useState({
        loading: false,
        results: [] as string[],
    });

    const setEnhancerLoading = (loading: boolean) => {
        setEnhancer((prev) => ({
            ...prev,
            loading: loading,
        }));
    };

    const setEnhancerResults = (results: string[]) => {
        setEnhancer((prev) => ({
            ...prev,
            results: results,
        }));
    };

    const [generator, setGenerator] = useState({
        loading: false,
        results: [] as string[],
        resultsKeep: [] as boolean[],
    });

    const setGeneratorLoading = (loading: boolean) => {
        setGenerator((prev) => ({
            ...prev,
            loading: loading,
        }));
    };

    const setGeneratorResults = (results: string[]) => {
        setGenerator((prev) => ({
            ...prev,
            results: results,
            resultsKeep: results.map(() => false),
        }));
    };

    const reset = () => {
        setEnhancer({
            loading: false,
            results: [],
        });

        setGenerator({
            loading: false,
            results: [],
            resultsKeep: [],
        });

        onClose();
    };

    // Get the current object
    const item = useMemo(() => {
        const sections = useResumeEditorStore.getState().sections;

        // find the section and item
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return;

        const item = section.items.find((i) => i.id === itemId);

        if (!item) return;
        return item;
    }, [sectionId, itemId]);

    // More context for AI
    const context = useMemo(() => {
        if (!item) return "";
        if (item.type === "experience") {
            const itemValue = item.value as IExperienceItem;
            return [
                "Experience",
                removeTags(itemValue.position),
                removeTags(itemValue.company),
                removeTags(itemValue.dates),
                removeTags(itemValue.location),
            ].join(",");
        }

        if (item.type === "project" || item.type === "project-nolinks") {
            const itemValue = item.value as IProjectItem;
            return [
                "Project",
                itemValue.name,
                itemValue.dates,
                itemValue.technologies,
                itemValue.source ?? "",
                itemValue.demo ?? "",
            ]
                .filter((a) => a !== "")
                .join(",");
        }

        return "";
    }, [item]);

    // Callback functions
    const onEnhancerSelect = async (text: string, index: number) => {
        if (!item) return;

        setEnhanceIndex(index);
        setEnhancerLoading(true);

        const itemValue = item.value as IExperienceItem;
        const otherPoints = itemValue.description
            .filter((_, i) => i !== index)
            .map((p) => removeTags(p))
            .join("\n");

        let allPoints = "";
        document.querySelectorAll("ul[contenteditable=true]").forEach((ul) => {
            allPoints += ul.textContent + "\n";
        });

        // remove allPoints, remove the ones from otherPoints
        allPoints = allPoints
            .split("\n")
            .filter((p) => p !== "")
            .filter((p) => !otherPoints.includes(p))
            .join("\n");

        // Start fetching
        const res = await fetch("/api/ask_ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "improve",
                point: removeTags(text),
                header: context,
                job: useResumeEditorStore.getState().jobDescription,
                otherPoints: otherPoints,
                allPoints: allPoints,
            }),
        });

        const resJson = await res.json();
        setEnhancerLoading(false);
        setEnhancerResults(resJson);
    };

    const onEnhancerSubmit = (index: number) => {
        const sections = useResumeEditorStore.getState().sections;

        // find the section and item
        const section = sections.find((s) => s.id === aiHelper.sectionId);
        if (!section) return;

        const item = section.items.find((i) => i.id === aiHelper.itemId);

        if (!item) return;
        const copy = { ...item };
        const value = copy.value as {
            description: string[];
        };

        value.description = value.description.map((d, index) => {
            if (index === aiHelper.chosenIndex) return point;
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
    };

    const onKeepChange = (index: number, checked: boolean) => {
        setGenerator((prev) => {
            const copy = [...prev.resultsKeep];
            copy[index] = checked;
            return {
                ...prev,
                resultsKeep: copy,
            };
        });
    };

    const onKeepSubmit = () => {
        const sections = useResumeEditorStore.getState().sections;

        // find the section and item
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return;

        const item = section.items.find((i) => i.id === itemId);

        if (!item) return;
        const copy = { ...item };
        const value = copy.value as {
            description: string[];
        };

        // List of points to keep
        const keptResults = generator.results.filter((_, i) => generator.resultsKeep[i]);
        value.description.push(...keptResults);

        // update the item's Description array at index chosenIndex
        updateItem(sectionId, itemId, copy);
        reset();
    };

    return (
        <Modal title="AI Bullet Enhancer" visible={visible} onClose={reset}>
            {/* Waiting messages */}
            {screen === EnhancerScreen.WaitGenerate && (
                <p className="print:hidden">Please wait while the AI is generating points...</p>
            )}
            {screen === EnhancerScreen.WaitEnhance && (
                <p className="print:hidden">Please wait for the AI to enhance your point...</p>
            )}
            {screen === EnhancerScreen.ResultGenerate && (
                <div className="print:hidden">
                    <p>Select which points to keep</p>
                    <div className="text-sm flex flex-col gap-2 mt-2">
                        {generator.results.map((point, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="checkbox"
                                    name="kept-generated-points"
                                    checked={generator.resultsKeep[i]}
                                    onChange={(e) => onKeepChange(i, e.target.checked)}
                                />
                                {point}
                            </div>
                        ))}
                        <Button
                            className="py-2 w-full font-semibold flex gap-2 justify-center mt-2"
                            onClick={onKeepSubmit}
                        >
                            <FaHandSparkles className="w-4 h-4" />
                            Confirm Selection
                        </Button>
                    </div>
                </div>
            )}
            {screen === EnhancerScreen.ResultEnhance && (
                <div className="print:hidden">
                    Select which option to use to replace point.
                    <ul className="list-disc list-inside text-sm">
                        {enhancer.results.map((point, i) => (
                            <li
                                className="text-primary hover:brightness-125 duration-300 cursor-pointer my-1"
                                onClick={() => onEnhancerSubmit(i)}
                                key={i}
                            >
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {screen === EnhancerScreen.Select && (
                <div className="print:hidden">
                    <p className="text-center mb-1">Select a point to improve with AI</p>
                    <ul className="list-disc list-inside text-sm">
                        {aiHelper.points.map((c, i) => (
                            <li
                                className="text-primary hover:brightness-125 duration-300 cursor-pointer my-1"
                                onClick={() => onEnhancerSelect(i)}
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
                            document.querySelectorAll("ul[contenteditable=true]").forEach((ul) => {
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
    );
};

export default EnhancerModal;
