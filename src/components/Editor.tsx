"use client";

import { FC, useState } from "react";
import EditableHeading from "./EditableHeading";
import EditableList from "./EditableList";
import EditableTwoSide from "./EditableTwoSide";
import Experience from "./section-items/Experience";

const Editor: FC = () => {
    const [title, setTitle] = useState<string>("Education");
    const [items, setItems] = useState<string[]>([]);

    const [topLeft, setTopLeft] = useState<string>("<b>Company</b>");
    const [topRight, setTopRight] = useState<string>("<b>Location</b>");
    const [bottomLeft, setBottomLeft] = useState<string>("<i>Occupation</i>");
    const [bottomRight, setBottomRight] = useState<string>("<i>Dates</i>");

    return (
        <div className="bg-white text-black p-4">
            <EditableHeading content={title} setContent={setTitle} />
            <Experience
                company={{ content: topLeft, setContent: setTopLeft }}
                position={{ content: bottomLeft, setContent: setBottomLeft }}
                date={{ content: bottomRight, setContent: setBottomRight }}
                location={{ content: topRight, setContent: setTopRight }}
                description={{ content: items, setContent: setItems }}
            />
        </div>
    );
};

export default Editor;
