"use client";
import useDocSettingsStore from "@/stores/useDocSettingsStore";
import React, { FC, useEffect, useRef, useState } from "react";
import "./EditableList.css";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import useStylingStore, { updateDisplayStyle } from "@/stores/useStylingStore";
import useFocusedListStore from "@/stores/useFocusedListStore";
import { useSection } from "./Section";

interface Props {
    items: string[];
    setItems: (items: string[]) => void;
    itemId: string;
}

const EditableList: FC<Props> = ({ items, setItems, itemId }) => {
    const { sectionId } = useSection();

    const ulRef = useRef<HTMLUListElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    // const aiRef = useRef<HTMLButtonElement>(null);

    const contentSize = useDocSettingsStore((state) => state.contentSize);
    const setFocusedList = useFocusedListStore((state) => state.setFocusedList);

    const handleKeyDown = (e: React.KeyboardEvent) => {
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

        if (
            (e.key === "Backspace" || e.key === "Delete") &&
            e.currentTarget.textContent === ""
        ) {
            e.preventDefault();
        }

        updateDisplayStyle();
    };

    const handleFocus = (e: React.FocusEvent<HTMLUListElement>) => {
        setFocusedList(sectionId, itemId);

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

        updateDisplayStyle();
    };

    const handleBlur = (e: React.FocusEvent<HTMLUListElement>) => {
        if (!e.relatedTarget || e.relatedTarget.tagName !== "UL") {
            setFocusedList("", "");
        }

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
                newItems.push(sanitizeHtml(item.innerHTML));
            }

            setItems(newItems);
        }

        useStylingStore.setState({
            isBold: false,
            isItalic: false,
            isUnderline: false,
        });
    };

    let innerHtml = items
        .map((item) => `<li>${sanitizeHtml(item)}</li>`)
        .join("");

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
            className={`ps-2.5 duration-300 hover:bg-primary/20 ce-list-unfocused`}
        >
            <div className="relative">
                <ul
                    ref={ulRef}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    // onPointerOver={handlePointerOver}
                    // onPointerLeave={handlePointerLeave}
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
        </div>
    );
};

export default EditableList;
