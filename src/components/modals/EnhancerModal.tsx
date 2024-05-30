import { FC, useEffect, useMemo, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { FaHandSparkles } from "react-icons/fa";
import useResumeEditorStore, {
    SectionItem,
} from "../../stores/useResumeEditorStore";
import {
    IEducationItem,
    IExperienceItem,
    IProjectItem,
    ITextItem,
} from "../../types/items";
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
    onClose: () => void;
}

const EnhancerModal: FC<Props> = ({ visible, sectionId, itemId, onClose }) => {
    const updateItem = useResumeEditorStore((state) => state.updateItem);

    // Handle selection
    const [enhanceIndex, setEnhanceIndex] = useState(-1);
    const [screen, setScreen] = useState(EnhancerScreen.Select);
    const [item, setItem] = useState<SectionItem | null>(null);

    // Handle results
    const [enhancer, setEnhancer] = useState({
        results: [] as string[],
    });

    const setEnhancerResults = (results: string[]) => {
        setEnhancer((prev) => ({
            ...prev,
            results: results,
        }));
    };

    const [generator, setGenerator] = useState({
        results: [] as string[],
        resultsKeep: [] as boolean[],
    });
    const reset = () => {
        setEnhancer({
            results: [],
        });

        setGenerator({
            results: [],
            resultsKeep: [],
        });

        setScreen(EnhancerScreen.Select);
        onClose();
    };

    // Get the current object
    useEffect(() => {
        const sections = useResumeEditorStore.getState().sections;

        // find the section and item
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return;

        const item = section.items.find((i) => i.id === itemId);
        setItem(item ?? null);
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
    const onEnhancerSelect = async (index: number, text: string) => {
        if (!item) return;

        setEnhanceIndex(index);
        setScreen(EnhancerScreen.WaitEnhance);
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
        try {
            const res = await fetch("/api/bullets/enhance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    point: removeTags(text),
                    header: context,
                    job: useResumeEditorStore.getState().jobDescription,
                    otherPoints: otherPoints,
                    allPoints: allPoints,
                }),
            });

            if (res.status !== 200) throw new Error("Failed to fetch");
            const resJson = await res.json();
            const results = resJson.data;

            setEnhancerResults(results);
            setScreen(EnhancerScreen.ResultEnhance);
        } catch (e) {
            console.error(e);
            setScreen(EnhancerScreen.Select);
        }
    };

    const onEnhancerSubmit = (index: number, point: string) => {
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

        value.description = value.description.map((d, i) => {
            if (i === index) return point;
            return d;
        });

        updateItem(sectionId, itemId, copy);
        reset();
    };

    const onGenerateSubmit = async () => {
        if (!item) return;

        setScreen(EnhancerScreen.WaitGenerate);

        const itemValue = item.value as IExperienceItem;
        const otherPoints = itemValue.description
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

        const res = await fetch("/api/bullets/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                header: context,
                job: useResumeEditorStore.getState().jobDescription,
                otherPoints: otherPoints,
                allPoints: allPoints,
            }),
        });

        if (res.status !== 200) throw new Error("Failed to fetch");
        const resJson = await res.json();
        const results = resJson.data;

        setGenerator({
            results: results,
            resultsKeep: results.map(() => true),
        });

        setScreen(EnhancerScreen.ResultGenerate);
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
        const keptResults = generator.results.filter(
            (_, i) => generator.resultsKeep[i]
        );
        value.description.push(...keptResults);

        // update the item's Description array at index chosenIndex
        updateItem(sectionId, itemId, copy);
        reset();
    };

    return (
        <Modal title="AI Bullet Enhancer" visible={visible} onClose={reset}>
            {/* Waiting messages */}
            {screen === EnhancerScreen.WaitGenerate && (
                <p>Please wait while the AI is generating points...</p>
            )}
            {screen === EnhancerScreen.WaitEnhance && (
                <p>Please wait for the AI to enhance your point...</p>
            )}
            {screen === EnhancerScreen.ResultGenerate && (
                <div>
                    <p>Select which points to keep</p>
                    <div className="text-sm flex flex-col gap-2 mt-2">
                        {generator.results.map((point, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="checkbox"
                                    name="kept-generated-points"
                                    checked={generator.resultsKeep[i]}
                                    onChange={(e) =>
                                        onKeepChange(i, e.target.checked)
                                    }
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
                <div>
                    Select which option to use to replace point.
                    <ul className="list-disc list-inside text-sm">
                        {enhancer.results.map((point, i) => (
                            <li
                                className="text-primary hover:brightness-125 duration-300 cursor-pointer my-1"
                                onClick={() =>
                                    onEnhancerSubmit(enhanceIndex, point)
                                }
                                key={i}
                            >
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {screen === EnhancerScreen.Select && (
                <div>
                    <p className="text-center mb-1">
                        Select a point to improve with AI
                    </p>
                    <ul className="list-disc list-inside text-sm">
                        {(item?.value as IExperienceItem)?.description?.map(
                            (c, i) => (
                                <li
                                    className="text-primary hover:brightness-125 duration-300 cursor-pointer my-1"
                                    onClick={() => onEnhancerSelect(i, removeTags(c))}
                                    key={i}
                                >
                                    {removeTags(c)}
                                </li>
                            )
                        ) ?? []}
                    </ul>
                    <hr className="my-2 opacity-50" />
                    <p className="text-sm text-center mb-1">Or, be creative</p>
                    <Button
                        theme="primary"
                        className="text-sm font-semibold px-4 w-full py-2 flex items-center gap-2 justify-center"
                        onClick={onGenerateSubmit}
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
