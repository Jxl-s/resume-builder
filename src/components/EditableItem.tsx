import { sanitizeHtml } from "@/utils/sanitizeHtml";
import React, { FC, useState } from "react";

interface Props {
    Component?: React.ElementType;
    placeholder?: string;
    className?: string;

    setContent: (content: string) => void;
    content: string;
    fontSize?: number;
}

const EditableItem: FC<Props> = ({
    Component = "span",
    placeholder = "",
    content,
    setContent,
    className,
    fontSize,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
        if (e.target.textContent === "") {
            setContent("");
            return;
        }

        setContent(e.target.innerHTML);
    };

    return (
        <Component
            contentEditable={true}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`outline-none cursor-pointer duration-300 hover:bg-primary/20 focus:bg-primary/20 focus:border-b focus:border-b-primary focus:cursor-auto ${className ?? ""}`}
            style={{
                fontSize: fontSize ? `${fontSize}pt` : undefined,
            }}
            dangerouslySetInnerHTML={{
                __html: sanitizeHtml(content),
            }}
        />
    );
};

export default EditableItem;
