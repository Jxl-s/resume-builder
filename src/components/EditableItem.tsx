import { sanitizeHtml } from "@/utils/sanitizeHtml";
import React, { FC, useEffect, useRef, useState } from "react";
import "./EditableItem.css";

interface Props {
    Component?: React.ElementType;
    defaultStyle?: string[];
    placeholder?: string;
    className?: string;

    setContent: (content: string) => void;
    content: string;
    fontSize?: number;
}

const EditableItem: FC<Props> = ({
    Component = "span",
    defaultStyle = [],
    placeholder = "",
    content,
    setContent,
    className,
    fontSize,
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

    const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
        if (e.target.textContent === "") {
            setContent("");
            return;
        }

        setContent(e.target.innerHTML);
    };

    const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
        if (e.currentTarget.textContent === "") {
            e.currentTarget.classList.add("empty-content");
        } else {
            e.currentTarget.classList.remove("empty-content");
        }
    };

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
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onInput={handleInput}
            className={`editable-item ${defaultStyle.map((s) => `ce-${s}`).join(" ")} outline-none cursor-pointer duration-300 hover:bg-primary/20 focus:bg-primary/20 focus:border-b focus:border-b-primary focus:cursor-auto ${className ?? ""}`}
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
