import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import React, { FC, useState } from "react";
import EditableItem from "./EditableItem";

interface Props {
    left: {
        placeholder: string;
        content: string;
        setContent: (content: string) => void;
        defaultStyle?: string[];
    };
    right: {
        placeholder: string;
        content: string;
        setContent: (content: string) => void;
        defaultStyle?: string[];
    };
}

const EditableTwoSide: FC<Props> = ({ left, right }) => {
    const contentSize = useDocSettingsStore((state) => state.contentSize);

    return (
        <article
            className="flex justify-between gap-4"
            style={{
                fontSize: `${contentSize}pt`,
            }}
        >
            <EditableItem
                Component={"span"}
                content={left.content}
                setContent={left.setContent}
                placeholder={left.placeholder}
                className="text-left"
                defaultStyle={left.defaultStyle ?? []}
            />
            <EditableItem
                Component={"span"}
                content={right.content}
                setContent={right.setContent}
                placeholder={right.placeholder}
                className="text-right"
                defaultStyle={right.defaultStyle ?? []}
            />
        </article>
    );
};

export default EditableTwoSide;
