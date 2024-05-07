"use client";

import useDocSettingsStore from "@/stores/useDocSettingsStore";
import React, { FC } from "react";
const EditableHeading: FC = () => {
    const headingSize = useDocSettingsStore((state) => state.headingSize);
    return (
        <h1
            contentEditable={"plaintext-only"}
            suppressContentEditableWarning={true}
            style={{
                fontSize: `${headingSize}pt`,
                fontWeight: "bold",
            }}
        >
            Hi
        </h1>
    );
};

export default EditableHeading;
