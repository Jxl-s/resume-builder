"use client";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import React, { FC, useEffect, useRef, useState } from "react";
import "./EditableList.css";

interface Props {
    items: string[];
    setItems: (items: string[]) => void;
}

const EditableList: FC<Props> = ({ items, setItems }) => {
    const ulRef = useRef<HTMLUListElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

    const contentSize = useDocSettingsStore((state) => state.contentSize);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (
            (e.key === "Backspace" || e.key === "Delete") &&
            e.currentTarget.textContent === ""
        ) {
            e.preventDefault();
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLUListElement>) => {
        if (divRef.current) {
            divRef.current.classList.remove("ce-list-unfocused");
            divRef.current.classList.add("ce-list-focused");
        }

        if (items.length === 0) {
            e.currentTarget.innerHTML = "<li></li>";
            const li = e.currentTarget.querySelector("li");
            if (!li) return;

            const range = document.createRange();
            range.setStart(li, 0);
            range.setEnd(li, 0);

            // Get the Selection object
            const selection = window.getSelection();
            if (!selection) return;

            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLUListElement>) => {
        if (divRef.current) {
            divRef.current.classList.add("ce-list-unfocused");
            divRef.current.classList.remove("ce-list-focused");
        }

        if (e.currentTarget.textContent === "") {
            setItems([]);
        } else {
            // parse the list and send
            const newItems = [];

            for (const item of Array.from(e.currentTarget.children)) {
                newItems.push(item.innerHTML);
            }

            setItems(newItems);
        }
    };

    let innerHtml = items.map((item) => `<li>${item}</li>`).join("");
    if (innerHtml === "") {
        innerHtml = Array.from({ length: 3 })
            .map(
                (_, i) => `<li class="opacity-50">Enter bullet point #${i}</li>`
            )
            .join("");
    }

    return (
        <div
            ref={divRef}
            className={`ps-4 duration-300 rounded-md hover:bg-primary/20 ce-list-unfocused`}
        >
            <ul
                ref={ulRef}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                contentEditable={true}
                spellCheck={false}
                suppressContentEditableWarning={true}
                className={`ce-list ps-2 py-0.5 list-disc list-outside border-none outline-none`}
                style={{
                    fontSize: `${contentSize}pt`,
                }}
                dangerouslySetInnerHTML={{
                    __html: innerHtml,
                }}
            />
        </div>
    );
};

export default EditableList;
