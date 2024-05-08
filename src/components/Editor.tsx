"use client";

import { FC, useEffect, useState } from "react";
import EditableTwoSide from "./EditableTwoSide";
import useResumeEditorStore from "@/stores/useResumeEditorStore";

const Editor: FC = () => {
    return (
        <div
            className="bg-white text-black p-4"
            style={{
                width: "595pt",
            }}
        >
            <EditableTwoSide
                left={{
                    content: "<b></b>",
                    placeholder: "Company",
                    setContent: (content) => console.log(content),
                    defaultStyle: ["bold"],
                }}
                right={{
                    content: "<b>Montreal, Canada</b>",
                    placeholder: "Location",
                    setContent: (content) => console.log(content),
                    defaultStyle: ["bold"],
                }}
            />
            <EditableTwoSide
                left={{
                    content: "<i>Software Engineer Intern</i>",
                    placeholder: "Role",
                    setContent: (content) => console.log(content),
                    defaultStyle: ["italic"],
                }}
                right={{
                    content: "<i>Jan 2024 - May 2024</i>",
                    placeholder: "Date",
                    setContent: (content) => console.log(content),
                    defaultStyle: ["italic"],
                }}
            />
        </div>
    );
};

export default Editor;
