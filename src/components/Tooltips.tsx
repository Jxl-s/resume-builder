"use client";
import { FC, PropsWithChildren, useState } from "react";
import { FaBold, FaItalic, FaLink, FaUnderline } from "react-icons/fa";
import Button from "./Button";
import useStylingStore, {
    queryIsLink,
    updateDisplayStyle,
} from "@/stores/useStylingStore";
import useResumeEditorStore from "@/stores/useResumeEditorStore";
import { validateLink, validateMailto } from "@/utils/sanitizeHtml";
import AskAi from "./ui/AskAi";
import ImportResume from "./ui/ImportResume";
import DownloadResume from "./ui/DownloadResume";
import fonts from "../app/fonts";
import useDocSettingsStore from "../stores/useDocSettingsStore";

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
                className={`rounded-lg ${
                    enabled ? "bg-primary" : "bg-dark3"
                } p-2 hover:brightness-125 duration-300 cursor-pointer`}
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
    const [showHyperlinkMenu, setShowHyperlinkMenu] = useState(false);
    const [hyperlinkUrl, setHyperlinkUrl] = useState("");

    const font = useDocSettingsStore((state) => state.font);
    const setFont = useDocSettingsStore((state) => state.setFont);

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
        }

        updateDisplayStyle();
    };

    const makeHyperlink = (url: string) => {
        document.execCommand("createLink", false, url);
    };

    return (
        <>
            <div className="flex justify-between w-full mb-2 print:hidden">
                <div className="flex gap-2 relative">
                    <select
                        className="rounded-lg bg-dark3 text-sm px-4 flex items-center"
                        value={font}
                        onChange={(e) => {
                            setFont(e.target.value as keyof typeof fonts);
                        }}
                    >
                        {Object.entries(fonts).map(([name, font], i) => (
                            <option key={i} value={name}>
                                {font.display}
                            </option>
                        ))}
                    </select>
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
                    <AskAi />
                </div>
                <div className="flex gap-2 relative">
                    <ImportResume />
                    <DownloadResume />
                </div>
            </div>
        </>
    );
};

export default Tooltips;
