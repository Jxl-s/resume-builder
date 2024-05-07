"use client";

import { FC, useState } from "react";
import EditableHeading from "./EditableHeading";
import EditableList from "./EditableList";

const Editor: FC = () => {
    const [items, setItems] = useState<string[]>([]);

    return (
        <div>
            <EditableHeading />
            <EditableList items={items} setItems={setItems} />
        </div>
    );
};

export default Editor;
