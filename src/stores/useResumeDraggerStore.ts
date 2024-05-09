import { create } from "zustand";

export enum DraggedOverType {
    None,
    Item,
    Section,
}

interface ResumeDragger {
    draggedItem: {
        type: DraggedOverType;
        id: string; // {section}-{item}
    };
    setDraggedItem: (type: DraggedOverType, id: string) => void;
}

const useResumeDraggerStore = create<ResumeDragger>((set) => ({
    draggedItem: { type: DraggedOverType.None, id: "" },
    draggedOver: { type: DraggedOverType.None, id: "" },

    setDraggedItem: (type, id) => set({ draggedItem: { type, id } }),
}));

export default useResumeDraggerStore;
