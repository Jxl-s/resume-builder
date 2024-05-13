"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
    FaBold,
    FaDownload,
    FaItalic,
    FaLink,
    FaUnderline,
} from "react-icons/fa";
import Button from "./Button";
import {
    FaCircleExclamation,
    FaFileImport,
    FaHandSparkles,
} from "react-icons/fa6";
import useStylingStore, {
    queryIsLink,
    updateDisplayStyle,
} from "@/stores/useStylingStore";
import useFocusedListStore from "@/stores/useFocusedListStore";
import Modal from "./Modal";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { IExperienceItem, IProjectItem } from "@/types/items";
import { removeTags, validateLink, validateMailto } from "@/utils/sanitizeHtml";

interface TooltipButtonProps {
    enabled: boolean;
    onClick: () => void;
    aside?: () => React.ReactNode;
}

const TooltipButton: FC<PropsWithChildren<TooltipButtonProps>> = ({
    enabled,
    onClick,
    children,
    aside,
}) => {
    return (
        <>
            <div
                className={`rounded-lg ${enabled ? "bg-primary" : "bg-dark3"} p-2 hover:brightness-125 duration-300 cursor-pointer`}
                onClick={onClick}
                onMouseDown={(e) => e.preventDefault()}
            >
                {children}
            </div>
            {aside?.()}
        </>
    );
};

const Tooltips: FC = () => {
    const isBold = useStylingStore((state) => state.isBold);
    const isItalic = useStylingStore((state) => state.isItalic);
    const isUnderline = useStylingStore((state) => state.isUnderline);
    const isHyperlink = useStylingStore((state) => state.isHyperlink);
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

    const [showHyperlinkMenu, setShowHyperlinkMenu] = useState(false);
    const [hyperlinkUrl, setHyperlinkUrl] = useState("");

    const makeItalic = () => {
        document.execCommand("italic");
        updateDisplayStyle();
    };

    const makeBold = () => {
        document.execCommand("bold");
        updateDisplayStyle();
    };

    const makeUnderline = () => {
        document.execCommand("underline");
        updateDisplayStyle();
    };

    const handleHyperlinkClick = () => {
        if (queryIsLink()) {
            const selection = window.getSelection();
            if (!selection) return;

            // Get parent element of the selection
            const parentElement = selection.anchorNode?.parentElement;
            if (!parentElement) return;

            const parentNode = parentElement.parentNode;
            if (!parentNode) return;

            // Check if the parent element is a link
            if (parentElement.tagName.toLowerCase() === "a") {
                // Get the text content of the link
                const linkText = parentElement.textContent ?? "";
                const textNode = document.createTextNode(linkText);

                // Replace the link with the text node
                parentNode.replaceChild(textNode, parentElement);
            }
        } else {
            // open hyperlink menu
            setShowHyperlinkMenu((prev) => !prev);
            // document.execCommand("createLink", false, "https://google.com");
        }

        updateDisplayStyle();
    };

    const makeHyperlink = (url: string) => {
        document.execCommand("createLink", false, url);
    };

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
                {aiSearcher.searching && <p>Please wait...</p>}
                {aiSearcher.searchResults.length > 0 && (
                    <>
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
                    </>
                )}
                {!aiSearcher.searching &&
                    aiSearcher.searchResults.length === 0 && (
                        <>
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
                        </>
                    )}
            </Modal>
            <div className="flex justify-between w-full mb-2">
                <div className="flex gap-2 relative">
                    <div className="rounded-lg bg-dark3 text-sm px-4 flex items-center">
                        Source Sans Pro
                    </div>
                    <div className="h-8 w-0.5 bg-white/25" />

                    <TooltipButton enabled={isBold} onClick={makeBold}>
                        <FaBold className="w-4 h-4" />
                    </TooltipButton>
                    <TooltipButton enabled={isItalic} onClick={makeItalic}>
                        <FaItalic className="w-4 h-4" />
                    </TooltipButton>
                    <TooltipButton
                        enabled={isUnderline}
                        onClick={makeUnderline}
                    >
                        <FaUnderline className="w-4 h-4" />
                    </TooltipButton>

                    <div className="h-8 w-0.5 bg-white/25" />
                    <div>
                        <TooltipButton
                            enabled={isHyperlink}
                            onClick={handleHyperlinkClick}
                            aside={() =>
                                showHyperlinkMenu && (
                                    <div
                                        className="absolute top-full bg-dark3 text-white p-2 rounded-lg"
                                        style={{
                                            top: "calc(100% + 0.25rem)",
                                        }}
                                    >
                                        <p className="text-xs text-secondary mb-1">
                                            Select some text, enter a link,
                                            click{" "}
                                            <span className="text-primary font-semibold">
                                                Add
                                            </span>
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                className="bg-transparent text-sm"
                                                placeholder="https://google.com"
                                                value={hyperlinkUrl}
                                                onChange={(e) =>
                                                    setHyperlinkUrl(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <Button
                                                theme="primary"
                                                className="text-sm font-semibold px-4 py-1"
                                                disabled={
                                                    !validateLink(
                                                        hyperlinkUrl
                                                    ) &&
                                                    !validateMailto(
                                                        hyperlinkUrl
                                                    )
                                                }
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    makeHyperlink(hyperlinkUrl)
                                                }
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }
                        >
                            <FaLink className="w-4 h-4" />
                        </TooltipButton>
                    </div>

                    <div className="h-8 w-0.5 bg-white/25" />
                    <Button
                        theme="primaryOutline"
                        className="text-sm font-semibold px-4 flex gap-2 items-center"
                        disabled={
                            focusedItemId === "" && focusedSectionId === ""
                        }
                        onClick={() => {
                            onAskAi(focusedSectionId, focusedItemId);
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <FaHandSparkles className="w-4 h-4" />
                        Ask AI
                    </Button>
                </div>
                <div className="flex gap-2 relative">
                    <Button
                        theme="danger"
                        className="text-sm font-semibold px-5 flex items-center gap-2"
                    >
                        <FaCircleExclamation className="w-4 h-4" />
                        Reset
                    </Button>
                    <Button
                        theme="secondary"
                        className="text-sm font-semibold px-5 flex items-center gap-2"
                    >
                        <FaFileImport className="w-4 h-4" />
                        Import
                    </Button>
                    <Button
                        theme="primary"
                        className="text-sm font-semibold px-5 flex items-center gap-2"
                    >
                        <FaDownload className="w-4 h-4" />
                        Download
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Tooltips;
