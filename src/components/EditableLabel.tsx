"use client";

import { FC, useEffect, useRef, useState } from "react";

interface Props {
    id: string;
    html: string;
    placeholder: string;

    // callbacks
    onChange?: (html: string) => void;
    onEntered?: () => void;
    onDeleted?: () => void;
}

const EditableLabel: FC<Props> = ({
    id,
    html = "",
    placeholder,
    onChange,
    onEntered,
    onDeleted,
}) => {
    const [showPlaceholder, setShowPlaceholder] = useState(html === "");
    const spanRef = useRef<HTMLSpanElement>(null);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!spanRef.current) return;

        // prevent new line on enter
        if (e.key === "Enter") {
            e.preventDefault();

            spanRef.current.blur();
            onEntered?.();
        }

        // alert deletion when backspace is pressed on empty content
        if (e.key === "Backspace" && spanRef.current.textContent === "") {
            e.preventDefault();
            onDeleted?.();
        }
    };

    const onBlur = () => {
        if (!spanRef.current) return;

        // properly handle empty content
        if (spanRef.current.textContent === "") {
            setShowPlaceholder(true);
            onChange?.("");
        } else {
            const newHtml = spanRef.current.innerHTML;
            onChange?.(newHtml);
        }
    };

    const onFocus = () => {
        setShowPlaceholder(false);
    };

    const onDivClick = () => {
        setShowPlaceholder(false);

        if (!spanRef.current) return;
        spanRef.current.focus();
    };

    return (
        <div onClick={onDivClick}>
            <span
                id={id}
                ref={spanRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
                className="border-none outline-none"
            />
            {showPlaceholder && (
                <span className="opacity-25">{placeholder}</span>
            )}
        </div>
    );
};

export default EditableLabel;
