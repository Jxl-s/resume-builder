import { sanitizeHtml } from "@/utils/sanitizeHtml";
import React, { FC, useEffect, useRef } from "react";
import "./EditableItem.css";
import type { TextStyle } from "@/types";

// This would be used by other components that compose of this one
export interface EditableItemProps {
    Component?: React.ElementType;

    defaultStyle?: TextStyle[];
    placeholder?: string;
    className?: string;
    fontSize?: number;

    content: string;
    setContent: (content: string) => void;
}

const EditableItem: FC<EditableItemProps> = ({
    Component = "span",

    defaultStyle = [],
    placeholder = "",
    className = "",
    fontSize,

    content,
    setContent,
}) => {
    const itemRef = useRef<HTMLElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === "b" || e.key === "i" || e.key === "u") {
                e.preventDefault();
                // apply the appropriate execcommand
                let command = "";
                if (e.key === "b") {
                    command = "bold";
                } else if (e.key === "i") {
                    command = "italic";
                } else if (e.key === "u") {
                    command = "underline";
                }

                document.execCommand(command, false);
            }
        }

        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    // Updating the content
    const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
        if (e.target.textContent === "") {
            setContent("");
            return;
        }

        setContent(e.target.innerHTML);
    };

    const applyDefaultStyle = () => {
        for (const style of defaultStyle) {
            if (!document.queryCommandState(style)) {
                document.execCommand(style);
            }
        }
    };

    // Handling placeholder and empty content
    const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
        if (e.currentTarget.textContent?.trim() === "") {
            e.currentTarget.classList.add("empty-content");
            applyDefaultStyle();
        } else {
            e.currentTarget.classList.remove("empty-content");
        }
    };

    // Initial placeholder handling
    useEffect(() => {
        if (!itemRef.current) return;
        if (itemRef.current.textContent === "") {
            itemRef.current.classList.add("empty-content");
        }
    }, []);

    return (
        <Component
            ref={itemRef}
            contentEditable={true}
            spellCheck={false}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleInput}
            onInput={handleInput}
            className={`editable-item outline-none cursor-pointer duration-300 hover:bg-primary/20 focus:bg-primary/20 focus:border-b focus:border-b-primary focus:cursor-auto ${defaultStyle.map((s) => `ce-${s}`).join(" ")} ${className}`}
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
