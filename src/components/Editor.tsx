"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import EditableLabel from "./EditableLabel";
import { v4 as uuidv4 } from "uuid";

type Label = {
    html: string;
    id: string;
};

// With the prefix
const generateId = () => `editor-label-${uuidv4()}`;

const Editor: FC = () => {
    const [labels, setLabels] = useState<Label[]>([
        { html: "hello", id: "editor-label-1" },
    ]);

    const [latestLabel, setLatestLabel] = useState<string>(labels[0].id);
    useEffect(() => {
        const labelElement = document.getElementById(latestLabel);
        if (!labelElement) return;

        // Focus the contenteditable element
        labelElement.focus();

        // Move the cursor to the end of the text content
        const selection = window.getSelection();
        if (!selection) return;

        const range = document.createRange();
        range.selectNodeContents(labelElement);
        range.collapse(false); // Move the cursor to the end
        selection.removeAllRanges();
        selection.addRange(range);
    }, [latestLabel]);

    return (
        <>
            <br />
            <ul className="list-disc p-6">
                {labels.map(({ html, id }, i) => (
                    <li key={i}>
                        <EditableLabel
                            id={id}
                            html={html}
                            placeholder="Add a label"
                            onChange={(newHtml) => {
                                setLabels((prev) => {
                                    const copy = [...prev];
                                    copy[i].html = newHtml;
                                    return copy;
                                });
                            }}
                            onDeleted={() => {
                                let prevIndex = i - 1;
                                if (prevIndex < 0) prevIndex = 0;

                                console.log(
                                    "prevIndex",
                                    prevIndex,
                                    labels[prevIndex].id
                                );
                                setLatestLabel(labels[prevIndex].id);
                                setLabels((prev) => {
                                    const copy = [...prev];
                                    copy.splice(i, 1);
                                    return copy;
                                });
                            }}
                            onEntered={() => {
                                const newUUID = generateId();

                                setLabels((prev) => {
                                    const copy = [...prev];
                                    copy.splice(i + 1, 0, {
                                        html: "",
                                        id: newUUID,
                                    });
                                    return copy;
                                });

                                setLatestLabel(newUUID);
                            }}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Editor;
