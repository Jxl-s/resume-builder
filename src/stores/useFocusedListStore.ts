import { create } from "zustand";

interface FocusedListStore {
    focusedSectionId: string;
    focusedItemId: string;
    setFocusedList: (sectionId: string, itemId: string) => void;
}

const useFocusedListStore = create<FocusedListStore>((set) => ({
    focusedSectionId: "",
    focusedItemId: "",
    setFocusedList: (sectionId, itemId) =>
        set(() => ({ focusedSectionId: sectionId, focusedItemId: itemId })),
}));

export default useFocusedListStore;
