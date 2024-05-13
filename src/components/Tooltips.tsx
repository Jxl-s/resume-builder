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
import { FaCircleExclamation } from "react-icons/fa6";
import useStylingStore from "@/stores/useStylingStore";

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

    return (
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
                <TooltipButton enabled={isUnderline} onClick={makeUnderline}>
                    <FaUnderline className="w-4 h-4" />
                </TooltipButton>

                <div className="h-8 w-0.5 bg-white/25" />
                <TooltipButton enabled={isHyperlink} onClick={() => {}}>
                    <FaLink className="w-4 h-4" />
                </TooltipButton>
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
                    theme="primary"
                    className="text-sm font-semibold px-5 flex items-center gap-2"
                >
                    <FaDownload className="w-4 h-4" />
                    Download
                </Button>
            </div>
        </div>
    );
};

export default Tooltips;
