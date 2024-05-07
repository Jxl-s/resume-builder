"use client";

import { FC, useState } from "react";
import EditableHeading from "./EditableHeading";
import EditableList from "./EditableList";

const Editor: FC = () => {
    const [title, setTitle] = useState<string>("Heading");
    const [items, setItems] = useState<string[]>([]);

    console.log(title);
    return (
        <div className="max-w-lg bg-white text-black p-4">
            <EditableHeading content={title} setContent={setTitle} />
            <EditableList items={items} setItems={setItems} />
        </div>
    );
};

export default Editor;
