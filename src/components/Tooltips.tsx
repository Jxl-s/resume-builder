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
import { FaCircleExclamation, FaFileImport, FaHandSparkles } from "react-icons/fa6";
import useStylingStore from "@/stores/useStylingStore";
import useFocusedListStore from "@/stores/useFocusedListStore";
import Modal from "./Modal";

interface TooltipButtonProps {
    enabled: boolean;
    onClick: () => void;
}

const TooltipButton: FC<PropsWithChildren<TooltipButtonProps>> = ({
    enabled,
    onClick,
    children,
}) => {
    return (
        <div
            className={`rounded-lg ${enabled ? "bg-primary" : "bg-dark3"} p-2 hover:brightness-125 duration-300 cursor-pointer`}
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
        >
            {children}
        </div>
    );
};

const Tooltips: FC = () => {
    const isBold = useStylingStore((state) => state.isBold);
    const isItalic = useStylingStore((state) => state.isItalic);
    const isUnderline = useStylingStore((state) => state.isUnderline);
    const isHyperlink = useStylingStore((state) => state.isHyperlink);
    const focusedList = useFocusedListStore((state) => state.focusedList);

    const [aiHelper, setAiHelper] = useState({
        listId: "",
        points: [] as string[],
        chosenIndex: -1,
    });

    const [aiSearcher, setAiSearcher] = useState({
        searching: false,
        searchResults: [] as string[],
    });

    const updateDisplayStyle = () => {
        useStylingStore.setState({
            isBold: document.queryCommandState("bold"),
            isItalic: document.queryCommandState("italic"),
            isUnderline: document.queryCommandState("underline"),
        });
    };

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

    const onAskAi = (listId: string) => {
        const list = document.getElementById(listId);
        if (list) {
            const points = Array.from(list.children)
                .filter((child) => child.textContent)
                .map((child) => child.textContent) as string[];

            setAiHelper({
                listId,
                points,
                chosenIndex: -1,
            });
        }
    };

    return (
        <>
            <Modal
                title="AI Helper"
                visible={aiHelper.listId !== ""}
                onClose={() => {
                    setAiHelper({ listId: "", points: [], chosenIndex: -1 });
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
                                        const listId = aiHelper.listId;
                                        const chosenIndex =
                                            aiHelper.chosenIndex;

                                        // replace the LI in the list
                                        const list =
                                            document.getElementById(listId);
                                        if (list) {
                                            // trigger a blur for the list
                                            list?.focus();

                                            const li = list.children[
                                                chosenIndex
                                            ] as HTMLLIElement;
                                            li.textContent = c;

                                            list?.blur();
                                        }

                                        setAiHelper({
                                            listId: "",
                                            points: [],
                                            chosenIndex: -1,
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
                                                        point: c,
                                                        header: "",
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
                    <TooltipButton enabled={isHyperlink} onClick={() => {}}>
                        <FaLink className="w-4 h-4" />
                    </TooltipButton>
                    <div className="h-8 w-0.5 bg-white/25" />

                    <Button
                        theme="primaryOutline"
                        className="text-sm font-semibold px-4 flex gap-2 items-center"
                        disabled={focusedList === ""}
                        onClick={() => {
                            onAskAi(focusedList);
                            if (document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur();
                            }
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
