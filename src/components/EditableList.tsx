"use client";
import DOMPurify from "isomorphic-dompurify";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import React, { FC, useEffect, useRef, useState } from "react";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

interface Props {
    items: string[];
    setItems: (items: string[]) => void;
}

const EditableList: FC<Props> = ({ items, setItems }) => {
    const ulRef = useRef<HTMLUListElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const contentSize = useDocSettingsStore((state) => state.contentSize);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && e.currentTarget.textContent === "") {
            e.preventDefault();
        }
    };

    const handleClick = () => {
        // create a new item if the list is empty
        if (items.length === 0) {
            setItems([""]);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLUListElement>) => {
        setIsFocused(false);

        // if the list is empty, set items to an empty array
        if (e.currentTarget.textContent === "") {
            setItems([]);
        } else {
            const newItems: string[] = [];

            for (const child of Array.from(e.currentTarget.children)) {
                // don't push empty items
                if (child.textContent !== "") {
                    newItems.push(child.innerHTML);
                }
            }

            setItems(newItems);
        }
    };

    useEffect(() => {
        if (!ulRef.current) return;
        let listItems = items.map((item) => {
            return `<li>${sanitizeHtml(item)}</li>`;
        });

        if (listItems.length === 0) {
            listItems = Array.from({ length: 3 }).map(
                (_, i) =>
                    `<li class="opacity-50">Enter bullet list item ${i + 1}</li>`
            );
        }

        ulRef.current.innerHTML = listItems.join("");
    }, [items]);

    return (
        <div
            className={`ps-4 duration-300 rounded-md ${isFocused && "bg-primary/20"} ${items.length === 0 && "cursor-pointer hover:bg-primary/20"}`}
            onClick={handleClick}
        >
            <ul
                ref={ulRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                contentEditable={true}
                spellCheck={false}
                suppressContentEditableWarning={true}
                className={`p-2 list-disc list-outside border-none outline-none`}
                style={{
                    fontSize: `${contentSize}pt`,
                }}
            />
        </div>
    );
};

export default EditableList;
