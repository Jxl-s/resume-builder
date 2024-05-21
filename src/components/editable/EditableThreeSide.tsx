import useDocSettingsStore from "@/stores/useDocSettingsStore";
import React, { FC, useState } from "react";
import EditableItem, { EditableItemProps } from "./EditableItem";

interface Props {
    left: EditableItemProps;
    afterLeft: EditableItemProps;
    right: EditableItemProps;
}

const EditableThreeSide: FC<Props> = ({ left, afterLeft, right }) => {
    const contentSize = useDocSettingsStore((state) => state.contentSize);

    return (
        <aside
            className="flex justify-between gap-1"
            style={{
                fontSize: `${contentSize}pt`,
            }}
        >
            <div className="flex gap-1">
                <EditableItem {...left} />
                |
                <EditableItem {...afterLeft} />
            </div>

            <EditableItem {...right} />
        </aside>
    );
};

export default EditableThreeSide;
