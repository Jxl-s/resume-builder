import { create } from "zustand";

interface FocusedListStore {
    focusedList: string;
    setFocusedList: (list: string) => void;
}

const useFocusedListStore = create<FocusedListStore>((set) => ({
    focusedList: "",
    setFocusedList: (list) => set({ focusedList: list }),
}));

export default useFocusedListStore;
