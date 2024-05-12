"use client";
import { FC, useEffect, useState } from "react";
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

const Tooltips: FC = () => {
    const [isBold, setIsBold] = useStylingStore((state) => [
        state.isBold,
        state.setIsBold,
    ]);

    const [isItalic, setIsItalic] = useStylingStore((state) => [
        state.isItalic,
        state.setIsItalic,
    ]);

    const [isUnderline, setIsUnderline] = useStylingStore((state) => [
        state.isUnderline,
        state.setIsUnderline,
    ]);

    const [isHyperlink, setIsHyperlink] = useStylingStore((state) => [
        state.isHyperlink,
        state.setIsHyperlink,
    ]);

    return (
        <div className="flex justify-between w-full mb-2">
            <div className="flex gap-2 relative">
                <div className="rounded-lg bg-dark3 text-sm px-4 flex items-center">
                    Source Sans Pro
                </div>
                <div className="h-8 w-0.5 bg-white/25" />
                <div
                    className={`rounded-lg ${isBold ? "bg-primary" : "bg-dark3"} p-2 hover:brightness-150 duration-300 cursor-pointer`}
                >
                    <FaBold className="w-4 h-4" />
                </div>
                <div
                    className={`rounded-lg ${isItalic ? "bg-primary" : "bg-dark3"} p-2 hover:brightness-150 duration-300 cursor-pointer`}
                >
                    <FaItalic className="w-4 h-4" />
                </div>
                <div
                    className={`rounded-lg ${isUnderline ? "bg-primary" : "bg-dark3"} p-2 hover:brightness-150 duration-300 cursor-pointer`}
                >
                    <FaUnderline className="w-4 h-4" />
                </div>
                <div className="h-8 w-0.5 bg-white/25" />
                <div
                    className={`rounded-lg ${isHyperlink ? "bg-primary" : "bg-dark3"} p-2 hover:brightness-150 duration-300 cursor-pointer`}
                >
                    <FaLink className="w-4 h-4" />
                </div>
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
