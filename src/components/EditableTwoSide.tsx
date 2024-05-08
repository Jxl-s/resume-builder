import useDocSettingsStore from "@/stores/useDocSettingsStore";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import React, { FC, useState } from "react";
import EditableItem, { EditableItemProps } from "./EditableItem";

interface Props {
    left: EditableItemProps;
    right: EditableItemProps;
}

const EditableTwoSide: FC<Props> = ({ left, right }) => {
    const contentSize = useDocSettingsStore((state) => state.contentSize);

    return (
        <article
            className="flex justify-between gap-4"
            style={{
                fontSize: `${contentSize}pt`,
            }}
        >
            <EditableItem {...left} />
            <EditableItem {...right} />
        </article>
    );
};

export default EditableTwoSide;
