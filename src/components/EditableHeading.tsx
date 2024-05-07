"use client";

import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import React, { FC } from "react";

interface Props {
    content: string;
    setContent: (content: string) => void;
}
const EditableHeading: FC<Props> = ({ content, setContent }) => {
    const headingSize = useDocSettingsStore((state) => state.headingSize);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
        setContent(e.target.innerText);
    };

    return (
        <h1
            contentEditable={"plaintext-only"}
            spellCheck={false}
            suppressContentEditableWarning={true}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="border-b-2 border-b-black outline-none mb-1"
            style={{
                fontSize: `${headingSize}pt`,
                fontWeight: "bold",
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
    );
};

export default EditableHeading;
